# Default Change Detection

### How this works?

This example shows how change detection is performed for each component after every VM turn. All components should light up when:

1. The app is **bootstrapped** (reload to double-check).
2. The "Trigger Change" button is **clicked**.


### @ViewChild()
- Configures a view query. **View queries** are set before `ngAfterViewInit` callback being fired.
