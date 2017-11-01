import { ClassInfo } from '../../components/classInfo';
import { Component } from '../../components/component';
import { ComponentInfo } from '../../components/componentInfo';
import { ConnectionInfo } from './connectionInfo';

export class Connect {

    public static readonly connectReducer = () => '<connected>';

    public static getConnectionInfo(propHolder: Component | object, propKey: string | symbol): ConnectionInfo {
        if (propHolder instanceof Component) {
            const compInfo = ComponentInfo.getInfo(propHolder);
            return compInfo && compInfo.connectedProps[propKey];
        } else {
            const compInfo = ClassInfo.getInfo(propHolder);
            return compInfo && compInfo.connectedProps[propKey];
        }
    }

    public static setupConnectedProps(target: Component, source: object) {        
        
        const sourceInfo = ClassInfo.getInfo(source);
        if (sourceInfo) {

            // copy metadata
            const targetInfo = ComponentInfo.getInfo(target);
            targetInfo.connectedProps = sourceInfo.connectedProps;

            // trigger connected props (necessary for connected props with initial 'undefined' value)
            for (let propKey of Object.keys(targetInfo.connectedProps)) {

                // tslint:disable-next-line:no-unused-expression
                (source as any)[propKey];
                var desc = Object.getOwnPropertyDescriptor(source, propKey);
                Object.defineProperty(target, propKey, desc);
            }
        }
    }
}