export const dataDescriptor: PropertyDescriptor = {
    writable: true,
    configurable: true,
    enumerable: true
};

export const accessorDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: true
};

export function deferredDefineProperty(target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const init = (isGet: boolean) => function (this: any, newVal?: any) {

        //
        // This code addresses an issue/limitation with typescript and defineProperty inside property decorator.        
        // https://stackoverflow.com/questions/43950908/typescript-decorator-and-object-defineproperty-weird-behavior
        //

        // Define the property.
        // This is called at runtime, so "this" is the instance.
        Object.defineProperty(this, propertyKey, descriptor);

        // Perform original action
        if (isGet) {
            return this[propertyKey];
        } else {
            this[propertyKey] = newVal;
        }
    };

    // Override property to let init occur on first get/set
    return Object.defineProperty(target, propertyKey, {
        get: init(true),
        set: init(false),
        enumerable: true,
        configurable: true
    });
}