#  custom-exception-filters Library

This library provides common exception filters for NestJS applications, including the AxiosExceptionFilter, AllExceptionFilter, and HttpExceptionFilter.


#### Installation

To install this library, use npm:

```
npm i @mia-platform-internal/taringa-exception-filters-library
```

### Usage

To use the exception filters in your NestJS application, follow these steps:

1. Import the exception filters from the library and APP_FILTER from @nestjs/core in your app.module.ts file and it as a provider as shown below

```
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter, AllExceptionFilter, AxiosExceptionFilter } from '@mia-platform-internal/taringa-exception-filters-library';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AxiosExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}

```

2. Now your application is using the provided exception filters.
#### Example

### Here is an example usage of the AxiosExceptionFilter:


```
import { Controller, Get, UseFilters } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
  @Get()
  @UseFilters(HttpExceptionFilter, AxiosExceptionFilter, AllExceptionFilter)
  async getData(): Promise<string> {
    try {
      const response = await axios.get('https://example.com/example');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

```

In this example, we are making a GET request to an external API using Axios. If the request fails, the AxiosExceptionFilter will catch the error and throw the defined response


### Here is an example usage of the AllExceptionFilter:

```
import { Controller, Get, UseFilters } from '@nestjs/common';
import axios from 'axios';

@Controller()
export class AppController {
  @Get()
  @UseFilters(HttpExceptionFilter, AxiosExceptionFilter, AllExceptionFilter)
  getData(): string {
    throw new Error('Something went wrong');
  }
}

```

In this example, we throw an error with the string 'Something went wrong' but the AllExceptionFilter with intercept it throwing an 'Internal server error' message with 500 status code