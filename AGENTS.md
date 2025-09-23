# Coding guidelines

* Do not add comments to the code.
* Do not explain the benefits of the implementation.

# Project Structure

* sequel models at app/models
* services at app/services
* controllers at app/controllers
* gateway to models at app/src/model
* abstraction sql at app/src/sql

# Testing

To install the dependencies run `rake testes:constroi`.

To start the testing environment use the `rake testes:liga`.

For running the suite test use the `rake testes:test`
