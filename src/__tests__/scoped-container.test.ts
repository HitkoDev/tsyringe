import {inject, injectable} from "../decorators";
import {instance as globalContainer} from "../dependency-container";

afterEach(() => {
  globalContainer.reset();
});

test("scopes' decorator creates scoped registration", () => {
  interface IFoo { } // tslint:disable-line no-empty-interface
  class Foo implements IFoo { }

  const container = globalContainer.createChildContainer();
  globalContainer.register("IFoo", {useClass: Foo});

  @container.injectable({token: "IFoo"})
  class ChildFoo implements IFoo { }

  @injectable()
  class Bar {
    constructor(
      @inject("IFoo") public foo: IFoo
    ) { }
  }

  const bar = globalContainer.resolve(Bar);
  const childBar = container.resolve(Bar);

  expect(bar.foo instanceof Foo).toBeTruthy();
  expect(childBar.foo instanceof ChildFoo).toBeTruthy();
});

test("scoped registration resolves even when container doesn't have registration", () => {
  interface IFoo { } // tslint:disable-line no-empty-interface
  class Foo implements IFoo { }

  @injectable({
    registrations: [{
      token: "IFoo",
      useClass: Foo
    }]
  })
  class Bar {
    constructor(
      @inject("IFoo") public foo: IFoo
    ) { }
  }

  const myBar = globalContainer.resolve(Bar);

  expect(globalContainer.isRegistered("IFoo")).toBeFalsy();
  expect(myBar.foo instanceof Foo).toBeTruthy();
});

test("scoped token resolves using containers' registration when scope doesn't have registration", () => {
  interface IFoo { } // tslint:disable-line no-empty-interface
  class Foo implements IFoo { }

  interface IBar { } // tslint:disable-line no-empty-interface
  class Bar implements IBar { }

  globalContainer.register("IFoo", {useClass: Foo});

  @injectable({
    registrations: [{
      token: "IBar",
      useClass: Bar
    }]
  })
  class FooBar {
    constructor(
      @inject("IFoo") public foo: IFoo,
      @inject("IBar") public bar: IBar
    ) { }
  }

  const myFooBar = globalContainer.resolve<FooBar>(FooBar);

  expect(myFooBar.foo instanceof Foo).toBeTruthy();
  expect(myFooBar.bar instanceof Bar).toBeTruthy();
});
