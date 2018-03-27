import { expect } from 'chai';
import { action, ReduxClassic, withId } from 'src';

describe('withId', () => {

    class Counter {
        
        public value = 0;

        @action
        public increment() {
            this.value = this.value + 1;
        }
    }

    it("syncs components with the same id but not others", () => {

        class App {

            @withId(88)
            public counter1 = new Counter();

            @withId(88)
            public counter2 = new Counter();

            public counter3 = new Counter();
        }

        const app = ReduxClassic.create(new App());
        try {

            app.root.counter1.increment();

            expect(app.root.counter1.value).to.eql(1);
            expect(app.root.counter2.value).to.eql(1);
            expect(app.root.counter3.value).to.eql(0);

        } finally {
            app.dispose();
        }
    });

    it("syncs deeply nested components", () => {

        const iAmAnId = {};

        class Level1First {
            public nested = new Level2First();
        }

        class Level2First {
            public nested = new Level3First();
        }

        class Level3First {
            @withId(iAmAnId)
            public counter = new Counter();
        }

        class Level1Second {
            public nested = new Level2Second();
        }

        class Level2Second {
            public nested = new Level3Second();
        }

        class Level3Second {
            @withId(iAmAnId)
            public counter = new Counter();
        }

        class App {
            public first = new Level1First();
            public second = new Level1Second();
        }
        const app = ReduxClassic.create(new App());
        try {

            app.root.first.nested.nested.counter.increment();

            expect(app.root.first.nested.nested.counter.value).to.eql(1);
            expect(app.root.second.nested.nested.counter.value).to.eql(1);

        } finally {
            app.dispose();
        }
    });

    it("multiple components decorated with no parameters (auto-id) are not synced with one another", () => {

        class App {

            @withId
            public counter1 = new Counter();

            @withId
            public counter2 = new Counter();

            @withId()
            public counter3 = new Counter();
        }
        const app = ReduxClassic.create(new App());
        try {

            app.root.counter1.increment();

            app.root.counter2.increment();
            app.root.counter2.increment();

            expect(app.root.counter1.value).to.eql(1);
            expect(app.root.counter2.value).to.eql(2);
            expect(app.root.counter3.value).to.eql(0);

        } finally {
            app.dispose();
        }
    });

});