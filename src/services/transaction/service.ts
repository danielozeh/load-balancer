interface ITransactionService {
    recordTransaction(transaction: any): Promise<any>,
    processTransaction(transaction: any): Promise<any>,
    periodicHealthCheck(): Promise<any>;
}

export default ITransactionService