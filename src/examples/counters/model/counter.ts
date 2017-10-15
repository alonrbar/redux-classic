
export class Counter {
    private static countersId = 1;

    public id = Counter.countersId++;
    public value = 0;
}