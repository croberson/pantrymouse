export class BaseModel {
    private tableName: string;

    id: number;

    constructor(table: string) {
        this.tableName = table;
    }

    public get() {

    }

    public getBy() {

    }

    public getAll() {

    }

    public getAllBy() {

    }

    public insert() {
        console.log("insert from base model: ", this);
    }

    public update() {
        console.log("update from base model: ", this);
    }

    public save() {
        if (this.id) {
            this.update();
        } else {
            this.insert();
        }
    }

    public run(qry, values) {

    }
}