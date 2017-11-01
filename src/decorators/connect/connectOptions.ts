import { DEFAULT_APP_NAME } from '../../reduxApp';

export class ConnectOptions {
    /**
     * The name of the ReduxApp instance to connect to.
     * If not specified will connect to default app.
     */
    public app?= DEFAULT_APP_NAME;
    /**
     * The ID of the target component (assuming the ID was assigned to the
     * component by the 'withId' decorator).
     * If not specified will connect to the first available component of that type.
     */
    public id?: any;
    /**
     * The 'connect' decorator uses a getter to connect to the it's target. By
     * default the getter is replaced with a standard value (reference) once the
     * first non-empty value is retrieved. Set this value to true to leave the
     * getter in place.
     * Default value: false
     */
    public live?= false;
}
