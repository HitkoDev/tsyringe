import {ClassProvider, FactoryProvider, InjectionToken, Provider, TokenProvider, ValueProvider} from "./providers";

/** Constructor type */
export type constructor<T> = { new(...args: any[]): T };

export type Dictionary<T> = { [key: string]: T };

export type ProviderRegistration<T = any, R extends T = T> = { token: InjectionToken<T>, options?: RegistrationOptions } & Provider<R>;

export type RegistrationOptions = {
  singleton: boolean;
  registrations?: ProviderRegistration[];
};

export interface DependencyContainer {
  register<T>(token: InjectionToken<T>, provider: ValueProvider<T>): DependencyContainer;
  register<T>(token: InjectionToken<T>, provider: FactoryProvider<T>): DependencyContainer;
  register<T>(token: InjectionToken<T>, provider: TokenProvider<T>, options?: RegistrationOptions): DependencyContainer;
  register<T>(token: InjectionToken<T>, provider: ClassProvider<T>, options?: RegistrationOptions): DependencyContainer;

  registerSingleton<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer;
  registerSingleton<T>(token: constructor<T>): DependencyContainer;

  registerType<T>(from: InjectionToken<T>, to: InjectionToken<T>): DependencyContainer;
  registerInstance<T>(token: InjectionToken<T>, instance: T): DependencyContainer;
  resolve<T>(token: InjectionToken<T>): T;
  isRegistered<T>(token: InjectionToken<T>): boolean;
  reset(): void;
  createChildContainer(): DependencyContainer;

  /**
   * Class decorator factory that allows the class' dependencies to be injected
   * at runtime.
   *
   * @return {Function} The class decorator
   */
  injectable<T, R extends T = T>(options?: { token?: InjectionToken<T>, registrations?: ProviderRegistration[] }): (target: constructor<R>) => void;

  /**
   * Class decorator factory that registers the class as a singleton within
   * the global container.
   *
   * @return {Function} The class decorator
   */
  singleton<T, R extends T = T>(options?: { token?: InjectionToken<T>, registrations?: ProviderRegistration[] }): (target: constructor<R>) => void;

  /**
   * Class decorator factory that replaces the decorated class' constructor with
   * a parameterless constructor that has dependencies auto-resolved
   *
   * Note: Resolution is performed using the global container
   *
   * @return {Function} The class decorator
   */
  autoInjectable(registrations?: ProviderRegistration[]): (target: constructor<any>) => constructor<any>;

  /**
   * Class decorator factory that allows constructor dependencies to be registered at runtime.
   *
   * @return {Function} The class decorator
   */
  registry(registrations?: ProviderRegistration[]): (target: any) => any;
}
