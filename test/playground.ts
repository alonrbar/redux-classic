import { expect } from 'chai';
import { component, withId, ReduxApp } from 'src';

describe('playground', () => {
    it("updates arrays and contained components correctly", () => {

        @component
        class App {
            public parents = [new ParentComponent()];
        }

        @component
        class ParentComponent {
            public arr: Component1[] = [];

            public push() {
                this.arr = this.arr.concat(new Component1());
            }

            public pop() {
                this.arr = this.arr.slice(0, this.arr.length - 1);
            }

            public assign() {
                const newComp = new Component1();
                newComp.value = 5;
                this.arr = this.arr.map((val, index) => index === 0 ? newComp : val);
            }

            public updateOdds() {
                this.arr.forEach((item, index) => {
                    if (index % 2 === 1) {
                        item.increment();
                        item.child.setMessage('hello_' + item.value);
                    }
                });
            }
        }

        @component
        class Component1 {
            public value = 0;

            @withId
            public child = new Component2();

            public increment() {
                this.value = this.value + 1;
            }
        }

        @component
        class Component2 {
            public message = 'hello';
            public setMessage(newMessage: string): void {
                this.message = newMessage;
            }
        }

        const app = new ReduxApp(new App());        

        // push

        expect(app.root.parents[0].arr.length).to.eql(0);

        debugger;

        app.root.parents[0].push();
        app.root.parents[0].push();

        expect(app.root.parents[0].arr.length).to.eql(2);

        // dispatch

        expect(app.root.parents[0].arr[0].child.message).to.eql('hello');
        expect(app.root.parents[0].arr[1].child.message).to.eql('hello');

        app.root.parents[0].updateOdds();

        expect(app.root.parents[0].arr[0].child.message).to.eql('hello');
        expect(app.root.parents[0].arr[1].child.message).to.eql('hello_1');

        // pop

        app.root.parents[0].pop();

        expect(app.root.parents[0].arr.length).to.eql(1);
        expect(app.root.parents[0].arr[0].child.message).to.eql('hello');

        // assign

        app.root.parents[0].push();
        app.root.parents[0].assign();

        expect(app.root.parents[0].arr.length).to.eql(2);
        expect(app.root.parents[0].arr[0].value).to.eql(5);
        expect(app.root.parents[0].arr[1].value).to.eql(0);
    });
});