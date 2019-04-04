import {INJECTION_TOKEN_METADATA_KEY} from "./reflection-helpers";
import {InjectionToken} from "./providers";
import {instance as globalContainer} from "./dependency-container";

/**
 * Class decorator factory that allows the class' dependencies to be injected
 * at runtime.
 *
 * @return {Function} The class decorator
 */
export const injectable = globalContainer.injectable;

/**
 * Class decorator factory that registers the class as a singleton within
 * the global container.
 *
 * @return {Function} The class decorator
 */
export const singleton = globalContainer.singleton;

/**
 * Class decorator factory that replaces the decorated class' constructor with
 * a parameterless constructor that has dependencies auto-resolved
 *
 * Note: Resolution is performed using the global container
 *
 * @return {Function} The class decorator
 */
export const autoInjectable = globalContainer.autoInjectable;

/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 *
 * @return {Function} The parameter decorator
 */
export function inject(token: InjectionToken<any>): (target: any, propertyKey: string | symbol, parameterIndex: number) => any {
  return function(target: any, _propertyKey: string | symbol, parameterIndex: number): any {
    const injectionTokens = Reflect.getOwnMetadata(INJECTION_TOKEN_METADATA_KEY, target) || {};
    injectionTokens[parameterIndex] = token;
    Reflect.defineMetadata(INJECTION_TOKEN_METADATA_KEY, injectionTokens, target);
  };
}

/**
 * Class decorator factory that allows constructor dependencies to be registered at runtime.
 *
 * @return {Function} The class decorator
 */
export const registry = globalContainer.registry;
