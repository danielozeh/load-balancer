import config from "../../config";
import ITransactionService from "./service";
import axios from 'axios';
import NodeCache from 'node-cache';
import { v4 as uuidv4 } from 'uuid';
import TransactionModel from '../../models/transaction';
let currentSwitchIndex = 0;
const cache = new NodeCache({ stdTTL: 60 }); // Cache health status for 60 seconds
const labelCache = new NodeCache({ stdTTL: 600 }); // Cache labeling results for 10 minutes

import fs from 'fs/promises';
import path from 'path';

const transactionsFilePath = path.join(__dirname, '../../data/transactions.json');

export default class TransactionService implements ITransactionService {
    /**
     * Process transaction function
     * @param transaction 
     * @returns object
     */
    async recordTransaction(transaction: any): Promise<any> {
        try {
            // generate tx_ref
            const tx_ref = uuidv4();
            transaction.tx_ref = tx_ref;
            console.log('Processing transaction: ', transaction)
            const switchObj: any = await this.getNextHealthSwitch();
            console.log('Switch: ', switchObj)
            const response = await axios.post(`${switchObj.url}/v1/transaction/process`, transaction);
            // console.log('Response: ', response)
            
            const label = await this.labelTransaction(transaction);

            return { status: true, message: 'Transaction processed successfully', data: {transaction, label} }
            
          } catch (error: any) {
            console.log(error)
            return { status: false, message: 'Transaction processing failed', error: error.message || 'An error occured', status_code: 500 }
          }
    }

    /**
     * Check if switch is healthy
     * @param switchUrl 
     * @returns 
     */
    async isSwitchHealthy(switchUrl: string) {
        try {
            const response = await axios.get(`${switchUrl}/health`);
            return response.status === 200;
        } catch (error: any) {
            console.error(`Switch ${switchUrl} health check failed`, error.message);
            return false;
        }
    }

    /**
     * Get next healthy switch
     * @returns 
     */
    async getNextHealthSwitch() {
        const switches = config.switches
        
        for (let i = 0; i < switches.length; i++) {
            currentSwitchIndex = (currentSwitchIndex + 1) % switches.length;
            const switchObj = switches[currentSwitchIndex];

            if (cache.get(switchObj.id) === false) continue;
        
            // Perform health check if not cached as healthy
            const healthy = await this.isSwitchHealthy(switchObj.url);
            // console.log('Switch: ', switchObj.id, 'is healthy: ', healthy)
            if (healthy) {
              cache.set(switchObj.id, true); // set switch as healthy
              return switchObj;
            } else {
              cache.set(switchObj.id, false); // set switch as unhealthy
            }
        }
    }

    /**
     * Labeling function
     * @param transaction 
     * @returns 
     */
    async labelTransaction(transaction: any) {
        // Check cache for previously labeled transactions for faster results
        const cachedLabel = labelCache.get(transaction.tx_ref);
        if (cachedLabel) return cachedLabel;

        // Apply rule-based labeling
        let label = this.applyRules(transaction);

        // If rules don't provide a label, use ML model for labeling
        if (!label) {
            label = await this.classifyWithModel(transaction);
        }

        transaction.label = label;
        transaction.created_at = new Date().toISOString();
        transaction.updated_at = new Date().toISOString();

        await this.saveTransactionToFile(transaction)

        // Cache the result to improve speed for similar future transactions
        labelCache.set(transaction.tx_ref, label);
        
        return label;
    }

    /**
     * Rule-based labeling function
     * @param transaction 
     * @returns 
     */
    applyRules(transaction: any): string | null {
        if (transaction.type === 'credit' && transaction.description.includes('refund')) {
            return 'Refund';
        }
        if (transaction.amount > 1000 && transaction.description.includes('purchase')) {
            return 'Large Purchase';
        }
        if (transaction.description.match(/salary|wages|payroll/i)) {
            return 'Salary Payment';
        }
        // more rules can be added here
        return null; // Return null if no rule matches
    }

    /**
     * ML-based classification function for labeling
     */
    async classifyWithModel(transaction: any): Promise<string> {
        try {
            const label = await this.classifyTransaction(transaction); // Hypothetical ML model function
            return label;
        } catch (error) {
            console.error("Model classification failed:", error);
            return 'Unclassified';
        }
    }

    async saveTransactionToDB(transaction: any, label: string) {
        try {
            // Check if the transaction is already in the database
            let existingTransaction = await TransactionModel.findOne({ tx_ref: transaction.tx_ref });

            if (existingTransaction) {
                // Update the label if the transaction exists
                existingTransaction.label = label;
                await existingTransaction.save();
            } else {
                // Otherwise, create a new transaction record
                await TransactionModel.create({
                    tx_ref: transaction.tx_ref,
                    type: transaction.type,
                    amount: transaction.amount,
                    description: transaction.description,
                    label: label,
                });
            }
        } catch (error) {
            console.error("Failed to save transaction to database:", error);
        }
    }

    async saveTransactionToFile(transaction: any) {
        const transactions: any = await this.readTransactionsFromFile();
        transactions.push(transaction);
        await this.writeTransactionsToFile(transactions);
    }

    /**
     * Uses past transactions to classify a transaction based on probability.
     * In a real-world case, this might use a pre-trained model.
     */
    async classifyTransaction(transaction: any): Promise<string> {
        // This is a hypothetical ML model function
        // In real world, this will be a ML model function which can be trained on past transactions
        // For now, we will use a simple rule-based approach to classify the transaction
        // We can use models built with machine learning libraries like TensorFlow, PyTorch, etc.

        const transactions = await this.readTransactionsFromFile();
        const pastTransactions = transactions.filter((t: any) => t.type === transaction.type);

        if (pastTransactions.length === 0) {
            return 'Unclassified';
        }

        // Calculate probabilities for different labels based on past transactions
        const labelCounts: Record<string, number> = {};
        pastTransactions.forEach((t: any) => {
            if (labelCounts[t.label]) {
                labelCounts[t.label]++;
            } else {
                labelCounts[t.label] = 1;
            }
        });

        // Determine the label with the highest probability
        let mostProbableLabel = 'Unclassified';
        let maxCount = 0;
        for (const label in labelCounts) {
            if (labelCounts[label] > maxCount) {
                maxCount = labelCounts[label];
                mostProbableLabel = label;
            }
        }

        return mostProbableLabel;
    }
    
    async readTransactionsFromFile(): Promise<[]> {
        try {
          const data = await fs.readFile(transactionsFilePath, 'utf-8');
          return JSON.parse(data);
        } catch (error: any) {
          // Return an empty array if the file doesn't exist
          if (error.code === 'ENOENT') return [];
          throw error;
        }
    }
      
    
    async writeTransactionsToFile(transactions: []): Promise<void> {
        const data = JSON.stringify(transactions, null, 2);
        await fs.writeFile(transactionsFilePath, data, 'utf-8');
    }
    /**
     * Periodic health check function
     */
    async periodicHealthCheck() {
        for (const switchObj of config.switches) {
            const healthy = await this.isSwitchHealthy(switchObj.url);
            console.log('Switch: ', switchObj.id, 'is healthy: ', healthy)
            cache.set(switchObj.id, healthy); // set switch as healthy or unhealthy
        }
    }

    async processTransaction(transaction: any): Promise<any> {
        console.log('Processing transaction: ', transaction)
        return { status: true, message: 'Transaction processed successfully', data: {} }
    }
}