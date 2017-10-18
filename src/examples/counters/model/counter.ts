
export class NestedStuff {
    public myNestedProp = 222;
}

export class Counter {
    private static countersId = 1;

    public id = Counter.countersId++;
    public value = 0;

    public nested = new NestedStuff();
}