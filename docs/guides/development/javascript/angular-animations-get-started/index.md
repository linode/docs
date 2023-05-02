---
slug: angular-animations-get-started
description: 'Get started creating Angular animations using components, states, triggers, and transitions. Learn the basics of animating an HTML div element with Angular.'
keywords: ['angular animations', 'create angular component', 'angular animation trigger', 'angular animation states', 'angular animation transitions', 'toggle function']
license: '[CC BY-ND 4.0](https://creativecommons.org/licenses/by-nd/4.0)'
published: 2022-04-22
modified_by:
  name: Linode
title: "Getting Started with Angular Animations"
title_meta: "Angular Animations: Get Started"
external_resources:
- '[Introduction to Angular Animations](https://angular.io/guide/animations)'
- '[Angular Components Overview](https://angular.io/guide/component-overview)'
authors: ["Cameron Laird"]
---

Web animations add dynamic graphics and effects to a web page. Movement on a web page communicates information to users and adds visual interest. Animation on a web page is typically achieved by changing the state of an HTML element over time. For example, an HTML element's color or position can change as a result of user interaction on a web page. Most popular web frameworks offer animation support that simplifies animating elements on your web pages or applications. This guide shows you how to get started creating animations using the Angular web framework.

## Setup the Angular Project

1. Follow the steps in our [Getting Started with Angular](/docs/guides/angular-tutorial-for-beginners/#getting-started-with-angular) guide to install Node.js, the Node Version Manager (nvm), and Angular. As a result of following those steps, you should have a directory named `example-app` in your home folder.

1. In your Angular project's root application module, enable the animations module by importing the `BrowserAnimationsModule` as shown in the following code:

    {{< file "/home/username/example-app/src/app/app.module.ts" >}}
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  declarations: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
    {{</ file >}}

    The `bootstrap` key bootstraps the component that contains the majority of your animation code. You create this code in the next section.

## Angular Animation Example

The example Angular code used in this guide animates the transition between two background colors contained within a `<div>` HTML element.

### Add Metadata to Angular Component

In your preferred text editor, open your Angular application's `/home/username/example-app/src/app/app.component.ts` file and add the `animations` metadata property to the declared component. The majority of the code used to animate the `<div>` element is contained in the `animations` metadata option.

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styleUrls: ['app.component.css'],
  animations: [
      //Add the animations metadata option
  ]
})
...
    {{</ file >}}

The HTML that is animated is stored in the component's HTML template which is the `./app.component.html` file. You add the HTML code to this file in the next section.

{{< note respectIndent=false >}}
Ensure that the top of your `app.component.ts` file includes the following import statements.

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
import { Component } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
{{< /file >}}
{{< /note >}}

### Create the Angular Component HTML Template

Your Angular project already contains a component HTML template file. The `app.component.ts` component file points to the location of the `./app.component.html` file in the `templateURL` metadata. In this section, you add the HTML to animate with Angular.

1. Open your Angular project's `/home/username/example-app/src/app/app.component.html` file and delete all of the example boilerplate code.

1. Add the example HTML template code as shown below:

    {{< file "/home/username/example-app/src/app/app.component.html" >}}

<h1>Angular Animation Example</h1>

<div (click)="changeState()" [@changeDivColor]=currentState >
  <h2>A Heading Contained in a Div</h2>
  <p>Click inside the Div to view the div's background color change using an Angular animation.</p>
</div>
    {{</ file >}}

     The HTML template adds a `<div>` element that gets animated. For now, the `<div>` does not call any of the functionality that enables the `<div>` to be animated. You add this in the next section.

1. Run the Angular local server with the following command:

        ng serve

1. Navigate to `http://localhost:4200` in a browser window and you should see the rendered HTML.

### Add an Angular Animation Trigger

In this section, you add an Angular animation *trigger*. The trigger is used to bind the animation code and behavior to the HTML element that you want to animate. The animation trigger contains the animation states that define the div's background color state change.

Open the component file and add the `trigger()` function to the `animations` metadata object.

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
@Component({
  selector: 'app-root',
  templateUrl: './div-animation.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('changeDivColor', [
        //Animation states are added here.
    ])
  ]
})
...
    {{</ file >}}

In the example above, `changeDivColor` is the animation trigger. This trigger can now be called in your Angular component template. You complete that step in one of the following sections. The next section shows you how to add animation states to your component.

### Add Angular Animation States

Angular animation *states* specify the change that you want to apply during your animation. For the example, the `<div>` background color's state should change from one color to another. You use Angular's `state()` function to name the state and define the element's CSS styles that are associated with the state.

Open the component file and add the two `state()` functions to the `changeDivColor` state of the `trigger()` function as shown below:

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
@Component({
  selector: 'app-root',
  templateUrl: './div-animation.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('changeDivColor', [
      state('start', style({
        border: '5px outset blue',
        backgroundColor: 'green',
        textAlign: 'center'
      })),
      state('end', style({
        border: '5px outset blue',
        backgroundColor: 'lightgreen',
        textAlign: 'center'
      })),
    ])
  ]
})
...
    {{</ file >}}

The `state` functions assign a name to each state and provide their associated styles. The `start` state uses a background color of `green`, while the `end` state uses a background color of light green.

### Add Angular Animation Transitions

Now, you need to define the Angular animation's *transitions* from one state to another. To do this, you use the `transition()` function.

Open the component file and add the `transition()` function to the end of the `trigger()` function as shown below:

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
...
@Component({
  selector: 'app-root',
  templateUrl: './div-animation.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('changeDivColor', [
      state('start', style({
        border: '5px outset blue',
        backgroundColor: 'green',
        textAlign: 'center'
      })),
      state('end', style({
        border: '5px outset blue',
        backgroundColor: 'lightgreen',
        textAlign: 'center'
      })),
      transition('start <=> end', animate('1000ms'))
    ])
  ]
})
...
    {{</ file >}}

The updated code above creates a state-to-state transition. The first state transition goes from the `start` state to the `end` state, while the second transition does the opposite. This state transition allows you to toggle between both states each time a user clicks on the bound HTML element (the `<div>` element). The `transition()` function uses the `animate()` function to specify the timing for the transition.

### Add the Toggle Function

Now that your animation is defined, you need to add a function that can detect the `<div>` state and toggle between the two states.

Add the following `toggleState()` function to your `AppComponent` class. The `AppComponent` class is located below the `@Component` decorator.

{{< file "/home/username/example-app/src/app/app.component.ts" >}}
...
export class AppComponent {
  title = 'example-app';

  divState = 'start';

  toggleState() {
    this.divState = this.divState === 'start' ? 'end' : 'start';
  }
}
    {{</ file >}}

The code above adds a `divState` variable that stores the current toggle state of the `<div>`. The `toggleState()` function uses a conditional ternary operator to update the value of `divState` depending on its current value.

Now that your animation code and toggle functionality is in place, you need to update the Angular HTML template to bind everything together. You complete this in the next section.

### Bind the Animation Trigger to the HTML Component Template

In this section, you bind the animation trigger you created in the previous steps to the `<div>` element.

1. Open your HTML component template and add the animation trigger to the `<div>`. You also add a `click` event that invokes the `toggleState()` function you added to the `AppComponent` class declaration.

    {{< file "/home/username/example-app/src/app/app.component.html" >}}
<h1>The div element</h1>

<div (click)="toggleState()" [@changeDivColor]=divState>
  <h2>This is a heading in a div element</h2>
  <p>This is some text in a div element.</p>
</div>
    {{</ file >}}

    Notice that the `@changeDivColor` trigger binding is set to the value of the `divState` variable. This enables the `div` to begin in the `start` toggle state. You are now ready to view your animation.

1. Navigate to `http://localhost:4200` in a browser window and you should see the rendered HTML.

    ![Angular rendered green HTML div.](green-html-div.jpg)

    Click inside the `<div>` container and you should see the animated background color transition from green to light green and vice versa, with each click.

    ![Angular rendered light green HTML div.](light-green-html-div.jpg)

## Conclusion

This guide showed you how to use the Angular framework to get started creating animations. Angular's [triggers](https://angular.io/api/animations/trigger), [states](https://angular.io/api/animations/state), and [transitions](https://angular.io/guide/transition-and-triggers) help you animate elements on a web page. The basic example included in this guide provides a foundation that you can use to [create more advanced animations](https://angular.io/guide/complex-animation-sequences) using the Angular `query()` and `stagger()` functions.