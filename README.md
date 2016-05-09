# Exploring Angular2 Change Detection

## NgZone
- An injectable service for executing work inside or outside of the Angular zone. The most common use of this service is to **optimize performance** when starting a work consisting of one or more asynchronous tasks that won't require UI updates or error handling ot be managed by Angular. Such tasks can be kicked off through **runOutSideAngular**.
- Zones monkey-patches any global asynchronous operations by the browser.

## Component LifeCycle Hooks
- `AfterViewChecked` **(7)**: Component will get notified after every check of your component's view if this particular interface is being implemented by component.
 
