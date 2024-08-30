export abstract class BulkPerformStrategy<SOURCE> {
  abstract mutate<TARGET>(entry: SOURCE): TARGET;
}
