import { autoInject, injectable } from "../src/decorators";
import {instance as globalContainer} from "../src/dependency-container";

afterEach(() => {
  globalContainer.reset();
});

test("@autoInject allows for injection to be performed without using .resolve()", () => {
  class Bar {}
  @autoInject()
  class Foo {
    constructor(public myBar?: Bar) {}
  }

  const myFoo = new Foo();

  expect(myFoo.myBar instanceof Bar).toBeTruthy();
});

test("@autoInject allows for parameters to be specified manually", () => {
  class Bar {}
  @autoInject()
  class Foo {
    constructor(public myBar?: Bar) {}
  }

  const myBar = new Bar();
  const myFoo = new Foo(myBar);

  expect(myFoo.myBar).toBe(myBar);
});

test("@autoInject injects parameters beyond those specified manually", () => {
  class Bar {}
  class FooBar {}
  @autoInject()
  class Foo {
    constructor(public myFooBar: FooBar, public myBar?: Bar) {}
  }

  const myFooBar = new FooBar();
  const myFoo = new Foo(myFooBar);

  expect(myFoo.myFooBar).toBe(myFooBar);
  expect(myFoo.myBar instanceof Bar).toBeTruthy();
});

test("@autoInject works when the @autoInject is a polymorphic ancestor", () => {
  class Foo {
    constructor() { }
  }

  @autoInject()
  class Ancestor {
    constructor(public myFoo?: Foo) {}
  }

  class Child extends Ancestor {
    constructor() {
      super();
    }
  }

  const instance = new Child();

  expect(instance.myFoo instanceof Foo).toBeTruthy();
});

test("@autoInject classes keep behavior from their ancestor's constructors", () => {
  const a = 5;
  const b = 4;
  class Foo {
    constructor() { }
  }

  @autoInject()
  class Ancestor {
    public a: number;
    constructor(public myFoo?: Foo) {
      this.a = a;
    }
  }

  class Child extends Ancestor {
    public b: number;
    constructor() {
      super();

      this.b = b;
    }
  }

  const instance = new Child();

  expect(instance.a).toBe(a);
  expect(instance.b).toBe(b);
});

test("@autoInject classes resolve their @injectable dependencies", () => {
  class Foo {}
  @injectable()
  class Bar {
    constructor(public myFoo: Foo) {}
  }
  @autoInject()
  class FooBar {
    constructor(public myBar?: Bar) {}
  }

  const myFooBar = new FooBar();

  expect(myFooBar.myBar!.myFoo instanceof Foo).toBeTruthy();
});