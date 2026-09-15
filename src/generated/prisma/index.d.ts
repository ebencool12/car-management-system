
/**
 * Client
**/

import * as runtime from './runtime/client.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Admin
 * 
 */
export type Admin = $Result.DefaultSelection<Prisma.$AdminPayload>
/**
 * Model Driver
 * 
 */
export type Driver = $Result.DefaultSelection<Prisma.$DriverPayload>
/**
 * Model Vehicle
 * 
 */
export type Vehicle = $Result.DefaultSelection<Prisma.$VehiclePayload>
/**
 * Model Application
 * 
 */
export type Application = $Result.DefaultSelection<Prisma.$ApplicationPayload>
/**
 * Model DriverReport
 * 
 */
export type DriverReport = $Result.DefaultSelection<Prisma.$DriverReportPayload>
/**
 * Model PartsExchange
 * 
 */
export type PartsExchange = $Result.DefaultSelection<Prisma.$PartsExchangePayload>
/**
 * Model SalesRecord
 * 
 */
export type SalesRecord = $Result.DefaultSelection<Prisma.$SalesRecordPayload>
/**
 * Model LedgerEntry
 * 
 */
export type LedgerEntry = $Result.DefaultSelection<Prisma.$LedgerEntryPayload>
/**
 * Model LocationPing
 * 
 */
export type LocationPing = $Result.DefaultSelection<Prisma.$LocationPingPayload>
/**
 * Model ChatConversation
 * 
 */
export type ChatConversation = $Result.DefaultSelection<Prisma.$ChatConversationPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient({
 *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
 * })
 * // Fetch zero or more Admins
 * const admins = await prisma.admin.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient({
   *   adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
   * })
   * // Fetch zero or more Admins
   * const admins = await prisma.admin.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */

  constructor(optionsArg ?: Prisma.PrismaClientConstructorArgs<ClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/raw-queries).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.admin`: Exposes CRUD operations for the **Admin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Admins
    * const admins = await prisma.admin.findMany()
    * ```
    */
  get admin(): Prisma.AdminDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driver`: Exposes CRUD operations for the **Driver** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Drivers
    * const drivers = await prisma.driver.findMany()
    * ```
    */
  get driver(): Prisma.DriverDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.vehicle`: Exposes CRUD operations for the **Vehicle** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Vehicles
    * const vehicles = await prisma.vehicle.findMany()
    * ```
    */
  get vehicle(): Prisma.VehicleDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.application`: Exposes CRUD operations for the **Application** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Applications
    * const applications = await prisma.application.findMany()
    * ```
    */
  get application(): Prisma.ApplicationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.driverReport`: Exposes CRUD operations for the **DriverReport** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DriverReports
    * const driverReports = await prisma.driverReport.findMany()
    * ```
    */
  get driverReport(): Prisma.DriverReportDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.partsExchange`: Exposes CRUD operations for the **PartsExchange** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PartsExchanges
    * const partsExchanges = await prisma.partsExchange.findMany()
    * ```
    */
  get partsExchange(): Prisma.PartsExchangeDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.salesRecord`: Exposes CRUD operations for the **SalesRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SalesRecords
    * const salesRecords = await prisma.salesRecord.findMany()
    * ```
    */
  get salesRecord(): Prisma.SalesRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.ledgerEntry`: Exposes CRUD operations for the **LedgerEntry** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LedgerEntries
    * const ledgerEntries = await prisma.ledgerEntry.findMany()
    * ```
    */
  get ledgerEntry(): Prisma.LedgerEntryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.locationPing`: Exposes CRUD operations for the **LocationPing** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LocationPings
    * const locationPings = await prisma.locationPing.findMany()
    * ```
    */
  get locationPing(): Prisma.LocationPingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatConversation`: Exposes CRUD operations for the **ChatConversation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatConversations
    * const chatConversations = await prisma.chatConversation.findMany()
    * ```
    */
  get chatConversation(): Prisma.ChatConversationDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 7.10.0
   * Query Engine version: 0edf323efd1d98336f3f0a68684b56f689b900d3
   */
  export type PrismaVersion = {
    client: string
    engine: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * Resolved type of the argument passed to the `PrismaClient` constructor.
   *
   * When called without a narrower options type (the common case), this resolves
   * to `PrismaClientOptions` directly, which produces a clear TypeScript error
   * message (`not assignable to parameter of type 'PrismaClientOptions'`) when
   * the argument is missing or incomplete. When the user supplies a narrower
   * options type (e.g. via a literal), it falls back to `Subset` to keep
   * filtering out unknown properties.
   */
  export type PrismaClientConstructorArgs<Options extends PrismaClientOptions> =
    [PrismaClientOptions] extends [Options] ? PrismaClientOptions : Subset<Options, PrismaClientOptions>;

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      ((Without<T, U> & U) | (Without<U, T> & T)) & object
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Admin: 'Admin',
    Driver: 'Driver',
    Vehicle: 'Vehicle',
    Application: 'Application',
    DriverReport: 'DriverReport',
    PartsExchange: 'PartsExchange',
    SalesRecord: 'SalesRecord',
    LedgerEntry: 'LedgerEntry',
    LocationPing: 'LocationPing',
    ChatConversation: 'ChatConversation',
    ChatMessage: 'ChatMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]



  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "admin" | "driver" | "vehicle" | "application" | "driverReport" | "partsExchange" | "salesRecord" | "ledgerEntry" | "locationPing" | "chatConversation" | "chatMessage"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Admin: {
        payload: Prisma.$AdminPayload<ExtArgs>
        fields: Prisma.AdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AdminFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AdminFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findFirst: {
            args: Prisma.AdminFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AdminFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          findMany: {
            args: Prisma.AdminFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          create: {
            args: Prisma.AdminCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          createMany: {
            args: Prisma.AdminCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AdminCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          delete: {
            args: Prisma.AdminDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          update: {
            args: Prisma.AdminUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          deleteMany: {
            args: Prisma.AdminDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AdminUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AdminUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>[]
          }
          upsert: {
            args: Prisma.AdminUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AdminPayload>
          }
          aggregate: {
            args: Prisma.AdminAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAdmin>
          }
          groupBy: {
            args: Prisma.AdminGroupByArgs<ExtArgs>
            result: $Utils.Optional<AdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.AdminCountArgs<ExtArgs>
            result: $Utils.Optional<AdminCountAggregateOutputType> | number
          }
        }
      }
      Driver: {
        payload: Prisma.$DriverPayload<ExtArgs>
        fields: Prisma.DriverFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriverFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriverFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          findFirst: {
            args: Prisma.DriverFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriverFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          findMany: {
            args: Prisma.DriverFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          create: {
            args: Prisma.DriverCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          createMany: {
            args: Prisma.DriverCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriverCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          delete: {
            args: Prisma.DriverDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          update: {
            args: Prisma.DriverUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          deleteMany: {
            args: Prisma.DriverDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriverUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriverUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>[]
          }
          upsert: {
            args: Prisma.DriverUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverPayload>
          }
          aggregate: {
            args: Prisma.DriverAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriver>
          }
          groupBy: {
            args: Prisma.DriverGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriverGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriverCountArgs<ExtArgs>
            result: $Utils.Optional<DriverCountAggregateOutputType> | number
          }
        }
      }
      Vehicle: {
        payload: Prisma.$VehiclePayload<ExtArgs>
        fields: Prisma.VehicleFieldRefs
        operations: {
          findUnique: {
            args: Prisma.VehicleFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.VehicleFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findFirst: {
            args: Prisma.VehicleFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.VehicleFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          findMany: {
            args: Prisma.VehicleFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          create: {
            args: Prisma.VehicleCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          createMany: {
            args: Prisma.VehicleCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.VehicleCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          delete: {
            args: Prisma.VehicleDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          update: {
            args: Prisma.VehicleUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          deleteMany: {
            args: Prisma.VehicleDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.VehicleUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.VehicleUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>[]
          }
          upsert: {
            args: Prisma.VehicleUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$VehiclePayload>
          }
          aggregate: {
            args: Prisma.VehicleAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVehicle>
          }
          groupBy: {
            args: Prisma.VehicleGroupByArgs<ExtArgs>
            result: $Utils.Optional<VehicleGroupByOutputType>[]
          }
          count: {
            args: Prisma.VehicleCountArgs<ExtArgs>
            result: $Utils.Optional<VehicleCountAggregateOutputType> | number
          }
        }
      }
      Application: {
        payload: Prisma.$ApplicationPayload<ExtArgs>
        fields: Prisma.ApplicationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApplicationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApplicationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findFirst: {
            args: Prisma.ApplicationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApplicationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          findMany: {
            args: Prisma.ApplicationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          create: {
            args: Prisma.ApplicationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          createMany: {
            args: Prisma.ApplicationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApplicationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          delete: {
            args: Prisma.ApplicationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          update: {
            args: Prisma.ApplicationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          deleteMany: {
            args: Prisma.ApplicationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApplicationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApplicationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>[]
          }
          upsert: {
            args: Prisma.ApplicationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApplicationPayload>
          }
          aggregate: {
            args: Prisma.ApplicationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApplication>
          }
          groupBy: {
            args: Prisma.ApplicationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApplicationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApplicationCountArgs<ExtArgs>
            result: $Utils.Optional<ApplicationCountAggregateOutputType> | number
          }
        }
      }
      DriverReport: {
        payload: Prisma.$DriverReportPayload<ExtArgs>
        fields: Prisma.DriverReportFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DriverReportFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DriverReportFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          findFirst: {
            args: Prisma.DriverReportFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DriverReportFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          findMany: {
            args: Prisma.DriverReportFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>[]
          }
          create: {
            args: Prisma.DriverReportCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          createMany: {
            args: Prisma.DriverReportCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DriverReportCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>[]
          }
          delete: {
            args: Prisma.DriverReportDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          update: {
            args: Prisma.DriverReportUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          deleteMany: {
            args: Prisma.DriverReportDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DriverReportUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DriverReportUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>[]
          }
          upsert: {
            args: Prisma.DriverReportUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DriverReportPayload>
          }
          aggregate: {
            args: Prisma.DriverReportAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDriverReport>
          }
          groupBy: {
            args: Prisma.DriverReportGroupByArgs<ExtArgs>
            result: $Utils.Optional<DriverReportGroupByOutputType>[]
          }
          count: {
            args: Prisma.DriverReportCountArgs<ExtArgs>
            result: $Utils.Optional<DriverReportCountAggregateOutputType> | number
          }
        }
      }
      PartsExchange: {
        payload: Prisma.$PartsExchangePayload<ExtArgs>
        fields: Prisma.PartsExchangeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PartsExchangeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PartsExchangeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          findFirst: {
            args: Prisma.PartsExchangeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PartsExchangeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          findMany: {
            args: Prisma.PartsExchangeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>[]
          }
          create: {
            args: Prisma.PartsExchangeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          createMany: {
            args: Prisma.PartsExchangeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PartsExchangeCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>[]
          }
          delete: {
            args: Prisma.PartsExchangeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          update: {
            args: Prisma.PartsExchangeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          deleteMany: {
            args: Prisma.PartsExchangeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PartsExchangeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PartsExchangeUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>[]
          }
          upsert: {
            args: Prisma.PartsExchangeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PartsExchangePayload>
          }
          aggregate: {
            args: Prisma.PartsExchangeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePartsExchange>
          }
          groupBy: {
            args: Prisma.PartsExchangeGroupByArgs<ExtArgs>
            result: $Utils.Optional<PartsExchangeGroupByOutputType>[]
          }
          count: {
            args: Prisma.PartsExchangeCountArgs<ExtArgs>
            result: $Utils.Optional<PartsExchangeCountAggregateOutputType> | number
          }
        }
      }
      SalesRecord: {
        payload: Prisma.$SalesRecordPayload<ExtArgs>
        fields: Prisma.SalesRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SalesRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SalesRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          findFirst: {
            args: Prisma.SalesRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SalesRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          findMany: {
            args: Prisma.SalesRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>[]
          }
          create: {
            args: Prisma.SalesRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          createMany: {
            args: Prisma.SalesRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SalesRecordCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>[]
          }
          delete: {
            args: Prisma.SalesRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          update: {
            args: Prisma.SalesRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          deleteMany: {
            args: Prisma.SalesRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SalesRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SalesRecordUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>[]
          }
          upsert: {
            args: Prisma.SalesRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SalesRecordPayload>
          }
          aggregate: {
            args: Prisma.SalesRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSalesRecord>
          }
          groupBy: {
            args: Prisma.SalesRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<SalesRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.SalesRecordCountArgs<ExtArgs>
            result: $Utils.Optional<SalesRecordCountAggregateOutputType> | number
          }
        }
      }
      LedgerEntry: {
        payload: Prisma.$LedgerEntryPayload<ExtArgs>
        fields: Prisma.LedgerEntryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LedgerEntryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LedgerEntryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findFirst: {
            args: Prisma.LedgerEntryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LedgerEntryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          findMany: {
            args: Prisma.LedgerEntryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          create: {
            args: Prisma.LedgerEntryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          createMany: {
            args: Prisma.LedgerEntryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LedgerEntryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          delete: {
            args: Prisma.LedgerEntryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          update: {
            args: Prisma.LedgerEntryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          deleteMany: {
            args: Prisma.LedgerEntryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LedgerEntryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LedgerEntryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>[]
          }
          upsert: {
            args: Prisma.LedgerEntryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LedgerEntryPayload>
          }
          aggregate: {
            args: Prisma.LedgerEntryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLedgerEntry>
          }
          groupBy: {
            args: Prisma.LedgerEntryGroupByArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryGroupByOutputType>[]
          }
          count: {
            args: Prisma.LedgerEntryCountArgs<ExtArgs>
            result: $Utils.Optional<LedgerEntryCountAggregateOutputType> | number
          }
        }
      }
      LocationPing: {
        payload: Prisma.$LocationPingPayload<ExtArgs>
        fields: Prisma.LocationPingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LocationPingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LocationPingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          findFirst: {
            args: Prisma.LocationPingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LocationPingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          findMany: {
            args: Prisma.LocationPingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>[]
          }
          create: {
            args: Prisma.LocationPingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          createMany: {
            args: Prisma.LocationPingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LocationPingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>[]
          }
          delete: {
            args: Prisma.LocationPingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          update: {
            args: Prisma.LocationPingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          deleteMany: {
            args: Prisma.LocationPingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LocationPingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LocationPingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>[]
          }
          upsert: {
            args: Prisma.LocationPingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LocationPingPayload>
          }
          aggregate: {
            args: Prisma.LocationPingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLocationPing>
          }
          groupBy: {
            args: Prisma.LocationPingGroupByArgs<ExtArgs>
            result: $Utils.Optional<LocationPingGroupByOutputType>[]
          }
          count: {
            args: Prisma.LocationPingCountArgs<ExtArgs>
            result: $Utils.Optional<LocationPingCountAggregateOutputType> | number
          }
        }
      }
      ChatConversation: {
        payload: Prisma.$ChatConversationPayload<ExtArgs>
        fields: Prisma.ChatConversationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatConversationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatConversationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          findFirst: {
            args: Prisma.ChatConversationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatConversationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          findMany: {
            args: Prisma.ChatConversationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          create: {
            args: Prisma.ChatConversationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          createMany: {
            args: Prisma.ChatConversationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatConversationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          delete: {
            args: Prisma.ChatConversationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          update: {
            args: Prisma.ChatConversationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          deleteMany: {
            args: Prisma.ChatConversationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatConversationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatConversationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>[]
          }
          upsert: {
            args: Prisma.ChatConversationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatConversationPayload>
          }
          aggregate: {
            args: Prisma.ChatConversationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatConversation>
          }
          groupBy: {
            args: Prisma.ChatConversationGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatConversationGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatConversationCountArgs<ExtArgs>
            result: $Utils.Optional<ChatConversationCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * A driver adapter that PrismaClient uses to connect to your database, such as the ones provided by `@prisma/adapter-pg`, `@prisma/adapter-libsql`, `@prisma/adapter-planetscale`, etc.
     * 
     * A driver adapter is **required** unless you connect to your database through Prisma Accelerate (in which case use `accelerateUrl` instead).
     * 
     * Learn more: https://pris.ly/d/driver-adapters
     * 
     * @example
     * ```ts
     * import { PrismaPg } from '@prisma/adapter-pg'
     * import { PrismaClient } from './generated/prisma/client'
     * 
     * const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
     * const prisma = new PrismaClient({ adapter })
     * ```
     */
    adapter?: runtime.SqlDriverAdapterFactory
    /**
     * The Prisma Accelerate connection URL. Use this option to connect to your database through Prisma Accelerate instead of using a driver adapter to connect directly.
     * 
     * Learn more: https://pris.ly/d/accelerate
     */
    accelerateUrl?: string
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[]
  }
  export type GlobalOmitConfig = {
    admin?: AdminOmit
    driver?: DriverOmit
    vehicle?: VehicleOmit
    application?: ApplicationOmit
    driverReport?: DriverReportOmit
    partsExchange?: PartsExchangeOmit
    salesRecord?: SalesRecordOmit
    ledgerEntry?: LedgerEntryOmit
    locationPing?: LocationPingOmit
    chatConversation?: ChatConversationOmit
    chatMessage?: ChatMessageOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type DriverCountOutputType
   */

  export type DriverCountOutputType = {
    reports: number
    partsExchanges: number
    salesRecords: number
    ledgerEntries: number
    sentMessages: number
    conversations1: number
    conversations2: number
  }

  export type DriverCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | DriverCountOutputTypeCountReportsArgs
    partsExchanges?: boolean | DriverCountOutputTypeCountPartsExchangesArgs
    salesRecords?: boolean | DriverCountOutputTypeCountSalesRecordsArgs
    ledgerEntries?: boolean | DriverCountOutputTypeCountLedgerEntriesArgs
    sentMessages?: boolean | DriverCountOutputTypeCountSentMessagesArgs
    conversations1?: boolean | DriverCountOutputTypeCountConversations1Args
    conversations2?: boolean | DriverCountOutputTypeCountConversations2Args
  }

  // Custom InputTypes
  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverCountOutputType
     */
    select?: DriverCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverReportWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountPartsExchangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartsExchangeWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountSalesRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesRecordWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountLedgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountSentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountConversations1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatConversationWhereInput
  }

  /**
   * DriverCountOutputType without action
   */
  export type DriverCountOutputTypeCountConversations2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatConversationWhereInput
  }


  /**
   * Count Type VehicleCountOutputType
   */

  export type VehicleCountOutputType = {
    reports: number
    partsExchanges: number
    locationPings: number
  }

  export type VehicleCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    reports?: boolean | VehicleCountOutputTypeCountReportsArgs
    partsExchanges?: boolean | VehicleCountOutputTypeCountPartsExchangesArgs
    locationPings?: boolean | VehicleCountOutputTypeCountLocationPingsArgs
  }

  // Custom InputTypes
  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the VehicleCountOutputType
     */
    select?: VehicleCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountReportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverReportWhereInput
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountPartsExchangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartsExchangeWhereInput
  }

  /**
   * VehicleCountOutputType without action
   */
  export type VehicleCountOutputTypeCountLocationPingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationPingWhereInput
  }


  /**
   * Count Type ChatConversationCountOutputType
   */

  export type ChatConversationCountOutputType = {
    messages: number
  }

  export type ChatConversationCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatConversationCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatConversationCountOutputType without action
   */
  export type ChatConversationCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversationCountOutputType
     */
    select?: ChatConversationCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatConversationCountOutputType without action
   */
  export type ChatConversationCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Admin
   */

  export type AggregateAdmin = {
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  export type AdminMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    passwordHash: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AdminCountAggregateOutputType = {
    id: number
    name: number
    email: number
    passwordHash: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AdminMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AdminCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    passwordHash?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admin to aggregate.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Admins
    **/
    _count?: true | AdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AdminMaxAggregateInputType
  }

  export type GetAdminAggregateType<T extends AdminAggregateArgs> = {
        [P in keyof T & keyof AggregateAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAdmin[P]>
      : GetScalarType<T[P], AggregateAdmin[P]>
  }




  export type AdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AdminWhereInput
    orderBy?: AdminOrderByWithAggregationInput | AdminOrderByWithAggregationInput[]
    by: AdminScalarFieldEnum[] | AdminScalarFieldEnum
    having?: AdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AdminCountAggregateInputType | true
    _min?: AdminMinAggregateInputType
    _max?: AdminMaxAggregateInputType
  }

  export type AdminGroupByOutputType = {
    id: string
    name: string
    email: string
    passwordHash: string
    createdAt: Date
    updatedAt: Date
    _count: AdminCountAggregateOutputType | null
    _min: AdminMinAggregateOutputType | null
    _max: AdminMaxAggregateOutputType | null
  }

  type GetAdminGroupByPayload<T extends AdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AdminGroupByOutputType[P]>
            : GetScalarType<T[P], AdminGroupByOutputType[P]>
        }
      >
    >


  export type AdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["admin"]>

  export type AdminSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    passwordHash?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AdminOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "email" | "passwordHash" | "createdAt" | "updatedAt", ExtArgs["result"]["admin"]>

  export type $AdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Admin"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      passwordHash: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["admin"]>
    composites: {}
  }

  type AdminGetPayload<S extends boolean | null | undefined | AdminDefaultArgs> = $Result.GetResult<Prisma.$AdminPayload, S>

  type AdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AdminFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AdminCountAggregateInputType | true
    }

  export interface AdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Admin'], meta: { name: 'Admin' } }
    /**
     * Find zero or one Admin that matches the filter.
     * @param {AdminFindUniqueArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AdminFindUniqueArgs>(args: SelectSubset<T, AdminFindUniqueArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Admin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AdminFindUniqueOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AdminFindUniqueOrThrowArgs>(args: SelectSubset<T, AdminFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AdminFindFirstArgs>(args?: SelectSubset<T, AdminFindFirstArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Admin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindFirstOrThrowArgs} args - Arguments to find a Admin
     * @example
     * // Get one Admin
     * const admin = await prisma.admin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AdminFindFirstOrThrowArgs>(args?: SelectSubset<T, AdminFindFirstOrThrowArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Admins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Admins
     * const admins = await prisma.admin.findMany()
     * 
     * // Get first 10 Admins
     * const admins = await prisma.admin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const adminWithIdOnly = await prisma.admin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AdminFindManyArgs>(args?: SelectSubset<T, AdminFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Admin.
     * @param {AdminCreateArgs} args - Arguments to create a Admin.
     * @example
     * // Create one Admin
     * const Admin = await prisma.admin.create({
     *   data: {
     *     // ... data to create a Admin
     *   }
     * })
     * 
     */
    create<T extends AdminCreateArgs>(args: SelectSubset<T, AdminCreateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Admins.
     * @param {AdminCreateManyArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AdminCreateManyArgs>(args?: SelectSubset<T, AdminCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Admins and returns the data saved in the database.
     * @param {AdminCreateManyAndReturnArgs} args - Arguments to create many Admins.
     * @example
     * // Create many Admins
     * const admin = await prisma.admin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AdminCreateManyAndReturnArgs>(args?: SelectSubset<T, AdminCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Admin.
     * @param {AdminDeleteArgs} args - Arguments to delete one Admin.
     * @example
     * // Delete one Admin
     * const Admin = await prisma.admin.delete({
     *   where: {
     *     // ... filter to delete one Admin
     *   }
     * })
     * 
     */
    delete<T extends AdminDeleteArgs>(args: SelectSubset<T, AdminDeleteArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Admin.
     * @param {AdminUpdateArgs} args - Arguments to update one Admin.
     * @example
     * // Update one Admin
     * const admin = await prisma.admin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AdminUpdateArgs>(args: SelectSubset<T, AdminUpdateArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Admins.
     * @param {AdminDeleteManyArgs} args - Arguments to filter Admins to delete.
     * @example
     * // Delete a few Admins
     * const { count } = await prisma.admin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AdminDeleteManyArgs>(args?: SelectSubset<T, AdminDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AdminUpdateManyArgs>(args: SelectSubset<T, AdminUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Admins and returns the data updated in the database.
     * @param {AdminUpdateManyAndReturnArgs} args - Arguments to update many Admins.
     * @example
     * // Update many Admins
     * const admin = await prisma.admin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Admins and only return the `id`
     * const adminWithIdOnly = await prisma.admin.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AdminUpdateManyAndReturnArgs>(args: SelectSubset<T, AdminUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Admin.
     * @param {AdminUpsertArgs} args - Arguments to update or create a Admin.
     * @example
     * // Update or create a Admin
     * const admin = await prisma.admin.upsert({
     *   create: {
     *     // ... data to create a Admin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Admin we want to update
     *   }
     * })
     */
    upsert<T extends AdminUpsertArgs>(args: SelectSubset<T, AdminUpsertArgs<ExtArgs>>): Prisma__AdminClient<$Result.GetResult<Prisma.$AdminPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Admins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminCountArgs} args - Arguments to filter Admins to count.
     * @example
     * // Count the number of Admins
     * const count = await prisma.admin.count({
     *   where: {
     *     // ... the filter for the Admins we want to count
     *   }
     * })
    **/
    count<T extends AdminCountArgs>(
      args?: Subset<T, AdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AdminAggregateArgs>(args: Subset<T, AdminAggregateArgs>): Prisma.PrismaPromise<GetAdminAggregateType<T>>

    /**
     * Group by Admin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AdminGroupByArgs['orderBy'] }
        : { orderBy?: AdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Admin model
   */
  readonly fields: AdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Admin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Admin model
   */
  interface AdminFieldRefs {
    readonly id: FieldRef<"Admin", 'String'>
    readonly name: FieldRef<"Admin", 'String'>
    readonly email: FieldRef<"Admin", 'String'>
    readonly passwordHash: FieldRef<"Admin", 'String'>
    readonly createdAt: FieldRef<"Admin", 'DateTime'>
    readonly updatedAt: FieldRef<"Admin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Admin findUnique
   */
  export type AdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findUniqueOrThrow
   */
  export type AdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin findFirst
   */
  export type AdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findFirstOrThrow
   */
  export type AdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admin to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin findMany
   */
  export type AdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter, which Admins to fetch.
     */
    where?: AdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Admins to fetch.
     */
    orderBy?: AdminOrderByWithRelationInput | AdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Admins.
     */
    cursor?: AdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Admins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Admins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Admins.
     */
    distinct?: AdminScalarFieldEnum | AdminScalarFieldEnum[]
  }

  /**
   * Admin create
   */
  export type AdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to create a Admin.
     */
    data: XOR<AdminCreateInput, AdminUncheckedCreateInput>
  }

  /**
   * Admin createMany
   */
  export type AdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
  }

  /**
   * Admin createManyAndReturn
   */
  export type AdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to create many Admins.
     */
    data: AdminCreateManyInput | AdminCreateManyInput[]
  }

  /**
   * Admin update
   */
  export type AdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data needed to update a Admin.
     */
    data: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
    /**
     * Choose, which Admin to update.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin updateMany
   */
  export type AdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin updateManyAndReturn
   */
  export type AdminUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The data used to update Admins.
     */
    data: XOR<AdminUpdateManyMutationInput, AdminUncheckedUpdateManyInput>
    /**
     * Filter which Admins to update
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to update.
     */
    limit?: number
  }

  /**
   * Admin upsert
   */
  export type AdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * The filter to search for the Admin to update in case it exists.
     */
    where: AdminWhereUniqueInput
    /**
     * In case the Admin found by the `where` argument doesn't exist, create a new Admin with this data.
     */
    create: XOR<AdminCreateInput, AdminUncheckedCreateInput>
    /**
     * In case the Admin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AdminUpdateInput, AdminUncheckedUpdateInput>
  }

  /**
   * Admin delete
   */
  export type AdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
    /**
     * Filter which Admin to delete.
     */
    where: AdminWhereUniqueInput
  }

  /**
   * Admin deleteMany
   */
  export type AdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Admins to delete
     */
    where?: AdminWhereInput
    /**
     * Limit how many Admins to delete.
     */
    limit?: number
  }

  /**
   * Admin without action
   */
  export type AdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Admin
     */
    select?: AdminSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Admin
     */
    omit?: AdminOmit<ExtArgs> | null
  }


  /**
   * Model Driver
   */

  export type AggregateDriver = {
    _count: DriverCountAggregateOutputType | null
    _avg: DriverAvgAggregateOutputType | null
    _sum: DriverSumAggregateOutputType | null
    _min: DriverMinAggregateOutputType | null
    _max: DriverMaxAggregateOutputType | null
  }

  export type DriverAvgAggregateOutputType = {
    balance: number | null
  }

  export type DriverSumAggregateOutputType = {
    balance: number | null
  }

  export type DriverMinAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
    passwordHash: string | null
  }

  export type DriverMaxAggregateOutputType = {
    id: string | null
    name: string | null
    phone: string | null
    email: string | null
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string | null
    balance: number | null
    createdAt: Date | null
    updatedAt: Date | null
    passwordHash: string | null
  }

  export type DriverCountAggregateOutputType = {
    id: number
    name: number
    phone: number
    email: number
    licenseDocUrl: number
    ghanaCardUrl: number
    irisScanUrl: number
    status: number
    balance: number
    createdAt: number
    updatedAt: number
    passwordHash: number
    _all: number
  }


  export type DriverAvgAggregateInputType = {
    balance?: true
  }

  export type DriverSumAggregateInputType = {
    balance?: true
  }

  export type DriverMinAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    passwordHash?: true
  }

  export type DriverMaxAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    passwordHash?: true
  }

  export type DriverCountAggregateInputType = {
    id?: true
    name?: true
    phone?: true
    email?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    balance?: true
    createdAt?: true
    updatedAt?: true
    passwordHash?: true
    _all?: true
  }

  export type DriverAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Driver to aggregate.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Drivers
    **/
    _count?: true | DriverCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DriverAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DriverSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriverMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriverMaxAggregateInputType
  }

  export type GetDriverAggregateType<T extends DriverAggregateArgs> = {
        [P in keyof T & keyof AggregateDriver]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriver[P]>
      : GetScalarType<T[P], AggregateDriver[P]>
  }




  export type DriverGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverWhereInput
    orderBy?: DriverOrderByWithAggregationInput | DriverOrderByWithAggregationInput[]
    by: DriverScalarFieldEnum[] | DriverScalarFieldEnum
    having?: DriverScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriverCountAggregateInputType | true
    _avg?: DriverAvgAggregateInputType
    _sum?: DriverSumAggregateInputType
    _min?: DriverMinAggregateInputType
    _max?: DriverMaxAggregateInputType
  }

  export type DriverGroupByOutputType = {
    id: string
    name: string
    phone: string
    email: string | null
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string
    balance: number
    createdAt: Date
    updatedAt: Date
    passwordHash: string
    _count: DriverCountAggregateOutputType | null
    _avg: DriverAvgAggregateOutputType | null
    _sum: DriverSumAggregateOutputType | null
    _min: DriverMinAggregateOutputType | null
    _max: DriverMaxAggregateOutputType | null
  }

  type GetDriverGroupByPayload<T extends DriverGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriverGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriverGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriverGroupByOutputType[P]>
            : GetScalarType<T[P], DriverGroupByOutputType[P]>
        }
      >
    >


  export type DriverSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordHash?: boolean
    assignedVehicle?: boolean | Driver$assignedVehicleArgs<ExtArgs>
    reports?: boolean | Driver$reportsArgs<ExtArgs>
    partsExchanges?: boolean | Driver$partsExchangesArgs<ExtArgs>
    salesRecords?: boolean | Driver$salesRecordsArgs<ExtArgs>
    ledgerEntries?: boolean | Driver$ledgerEntriesArgs<ExtArgs>
    applicationRef?: boolean | Driver$applicationRefArgs<ExtArgs>
    sentMessages?: boolean | Driver$sentMessagesArgs<ExtArgs>
    conversations1?: boolean | Driver$conversations1Args<ExtArgs>
    conversations2?: boolean | Driver$conversations2Args<ExtArgs>
    _count?: boolean | DriverCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordHash?: boolean
  }, ExtArgs["result"]["driver"]>

  export type DriverSelectScalar = {
    id?: boolean
    name?: boolean
    phone?: boolean
    email?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    balance?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    passwordHash?: boolean
  }

  export type DriverOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "phone" | "email" | "licenseDocUrl" | "ghanaCardUrl" | "irisScanUrl" | "status" | "balance" | "createdAt" | "updatedAt" | "passwordHash", ExtArgs["result"]["driver"]>
  export type DriverInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedVehicle?: boolean | Driver$assignedVehicleArgs<ExtArgs>
    reports?: boolean | Driver$reportsArgs<ExtArgs>
    partsExchanges?: boolean | Driver$partsExchangesArgs<ExtArgs>
    salesRecords?: boolean | Driver$salesRecordsArgs<ExtArgs>
    ledgerEntries?: boolean | Driver$ledgerEntriesArgs<ExtArgs>
    applicationRef?: boolean | Driver$applicationRefArgs<ExtArgs>
    sentMessages?: boolean | Driver$sentMessagesArgs<ExtArgs>
    conversations1?: boolean | Driver$conversations1Args<ExtArgs>
    conversations2?: boolean | Driver$conversations2Args<ExtArgs>
    _count?: boolean | DriverCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DriverIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type DriverIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $DriverPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Driver"
    objects: {
      assignedVehicle: Prisma.$VehiclePayload<ExtArgs> | null
      reports: Prisma.$DriverReportPayload<ExtArgs>[]
      partsExchanges: Prisma.$PartsExchangePayload<ExtArgs>[]
      salesRecords: Prisma.$SalesRecordPayload<ExtArgs>[]
      ledgerEntries: Prisma.$LedgerEntryPayload<ExtArgs>[]
      applicationRef: Prisma.$ApplicationPayload<ExtArgs> | null
      sentMessages: Prisma.$ChatMessagePayload<ExtArgs>[]
      conversations1: Prisma.$ChatConversationPayload<ExtArgs>[]
      conversations2: Prisma.$ChatConversationPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      phone: string
      email: string | null
      licenseDocUrl: string | null
      ghanaCardUrl: string | null
      irisScanUrl: string | null
      status: string
      balance: number
      createdAt: Date
      updatedAt: Date
      passwordHash: string
    }, ExtArgs["result"]["driver"]>
    composites: {}
  }

  type DriverGetPayload<S extends boolean | null | undefined | DriverDefaultArgs> = $Result.GetResult<Prisma.$DriverPayload, S>

  type DriverCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriverFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriverCountAggregateInputType | true
    }

  export interface DriverDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Driver'], meta: { name: 'Driver' } }
    /**
     * Find zero or one Driver that matches the filter.
     * @param {DriverFindUniqueArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriverFindUniqueArgs>(args: SelectSubset<T, DriverFindUniqueArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Driver that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriverFindUniqueOrThrowArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriverFindUniqueOrThrowArgs>(args: SelectSubset<T, DriverFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Driver that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindFirstArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriverFindFirstArgs>(args?: SelectSubset<T, DriverFindFirstArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Driver that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindFirstOrThrowArgs} args - Arguments to find a Driver
     * @example
     * // Get one Driver
     * const driver = await prisma.driver.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriverFindFirstOrThrowArgs>(args?: SelectSubset<T, DriverFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Drivers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Drivers
     * const drivers = await prisma.driver.findMany()
     * 
     * // Get first 10 Drivers
     * const drivers = await prisma.driver.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const driverWithIdOnly = await prisma.driver.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DriverFindManyArgs>(args?: SelectSubset<T, DriverFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Driver.
     * @param {DriverCreateArgs} args - Arguments to create a Driver.
     * @example
     * // Create one Driver
     * const Driver = await prisma.driver.create({
     *   data: {
     *     // ... data to create a Driver
     *   }
     * })
     * 
     */
    create<T extends DriverCreateArgs>(args: SelectSubset<T, DriverCreateArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Drivers.
     * @param {DriverCreateManyArgs} args - Arguments to create many Drivers.
     * @example
     * // Create many Drivers
     * const driver = await prisma.driver.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriverCreateManyArgs>(args?: SelectSubset<T, DriverCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Drivers and returns the data saved in the database.
     * @param {DriverCreateManyAndReturnArgs} args - Arguments to create many Drivers.
     * @example
     * // Create many Drivers
     * const driver = await prisma.driver.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Drivers and only return the `id`
     * const driverWithIdOnly = await prisma.driver.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriverCreateManyAndReturnArgs>(args?: SelectSubset<T, DriverCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Driver.
     * @param {DriverDeleteArgs} args - Arguments to delete one Driver.
     * @example
     * // Delete one Driver
     * const Driver = await prisma.driver.delete({
     *   where: {
     *     // ... filter to delete one Driver
     *   }
     * })
     * 
     */
    delete<T extends DriverDeleteArgs>(args: SelectSubset<T, DriverDeleteArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Driver.
     * @param {DriverUpdateArgs} args - Arguments to update one Driver.
     * @example
     * // Update one Driver
     * const driver = await prisma.driver.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriverUpdateArgs>(args: SelectSubset<T, DriverUpdateArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Drivers.
     * @param {DriverDeleteManyArgs} args - Arguments to filter Drivers to delete.
     * @example
     * // Delete a few Drivers
     * const { count } = await prisma.driver.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriverDeleteManyArgs>(args?: SelectSubset<T, DriverDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Drivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Drivers
     * const driver = await prisma.driver.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriverUpdateManyArgs>(args: SelectSubset<T, DriverUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Drivers and returns the data updated in the database.
     * @param {DriverUpdateManyAndReturnArgs} args - Arguments to update many Drivers.
     * @example
     * // Update many Drivers
     * const driver = await prisma.driver.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Drivers and only return the `id`
     * const driverWithIdOnly = await prisma.driver.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DriverUpdateManyAndReturnArgs>(args: SelectSubset<T, DriverUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Driver.
     * @param {DriverUpsertArgs} args - Arguments to update or create a Driver.
     * @example
     * // Update or create a Driver
     * const driver = await prisma.driver.upsert({
     *   create: {
     *     // ... data to create a Driver
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Driver we want to update
     *   }
     * })
     */
    upsert<T extends DriverUpsertArgs>(args: SelectSubset<T, DriverUpsertArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Drivers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverCountArgs} args - Arguments to filter Drivers to count.
     * @example
     * // Count the number of Drivers
     * const count = await prisma.driver.count({
     *   where: {
     *     // ... the filter for the Drivers we want to count
     *   }
     * })
    **/
    count<T extends DriverCountArgs>(
      args?: Subset<T, DriverCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriverCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Driver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DriverAggregateArgs>(args: Subset<T, DriverAggregateArgs>): Prisma.PrismaPromise<GetDriverAggregateType<T>>

    /**
     * Group by Driver.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DriverGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriverGroupByArgs['orderBy'] }
        : { orderBy?: DriverGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DriverGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriverGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Driver model
   */
  readonly fields: DriverFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Driver.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriverClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignedVehicle<T extends Driver$assignedVehicleArgs<ExtArgs> = {}>(args?: Subset<T, Driver$assignedVehicleArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reports<T extends Driver$reportsArgs<ExtArgs> = {}>(args?: Subset<T, Driver$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    partsExchanges<T extends Driver$partsExchangesArgs<ExtArgs> = {}>(args?: Subset<T, Driver$partsExchangesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    salesRecords<T extends Driver$salesRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Driver$salesRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    ledgerEntries<T extends Driver$ledgerEntriesArgs<ExtArgs> = {}>(args?: Subset<T, Driver$ledgerEntriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    applicationRef<T extends Driver$applicationRefArgs<ExtArgs> = {}>(args?: Subset<T, Driver$applicationRefArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    sentMessages<T extends Driver$sentMessagesArgs<ExtArgs> = {}>(args?: Subset<T, Driver$sentMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    conversations1<T extends Driver$conversations1Args<ExtArgs> = {}>(args?: Subset<T, Driver$conversations1Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    conversations2<T extends Driver$conversations2Args<ExtArgs> = {}>(args?: Subset<T, Driver$conversations2Args<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Driver model
   */
  interface DriverFieldRefs {
    readonly id: FieldRef<"Driver", 'String'>
    readonly name: FieldRef<"Driver", 'String'>
    readonly phone: FieldRef<"Driver", 'String'>
    readonly email: FieldRef<"Driver", 'String'>
    readonly licenseDocUrl: FieldRef<"Driver", 'String'>
    readonly ghanaCardUrl: FieldRef<"Driver", 'String'>
    readonly irisScanUrl: FieldRef<"Driver", 'String'>
    readonly status: FieldRef<"Driver", 'String'>
    readonly balance: FieldRef<"Driver", 'Float'>
    readonly createdAt: FieldRef<"Driver", 'DateTime'>
    readonly updatedAt: FieldRef<"Driver", 'DateTime'>
    readonly passwordHash: FieldRef<"Driver", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Driver findUnique
   */
  export type DriverFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver findUniqueOrThrow
   */
  export type DriverFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver findFirst
   */
  export type DriverFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drivers.
     */
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver findFirstOrThrow
   */
  export type DriverFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Driver to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drivers.
     */
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver findMany
   */
  export type DriverFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter, which Drivers to fetch.
     */
    where?: DriverWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Drivers to fetch.
     */
    orderBy?: DriverOrderByWithRelationInput | DriverOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Drivers.
     */
    cursor?: DriverWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Drivers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Drivers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Drivers.
     */
    distinct?: DriverScalarFieldEnum | DriverScalarFieldEnum[]
  }

  /**
   * Driver create
   */
  export type DriverCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The data needed to create a Driver.
     */
    data: XOR<DriverCreateInput, DriverUncheckedCreateInput>
  }

  /**
   * Driver createMany
   */
  export type DriverCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Drivers.
     */
    data: DriverCreateManyInput | DriverCreateManyInput[]
  }

  /**
   * Driver createManyAndReturn
   */
  export type DriverCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * The data used to create many Drivers.
     */
    data: DriverCreateManyInput | DriverCreateManyInput[]
  }

  /**
   * Driver update
   */
  export type DriverUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The data needed to update a Driver.
     */
    data: XOR<DriverUpdateInput, DriverUncheckedUpdateInput>
    /**
     * Choose, which Driver to update.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver updateMany
   */
  export type DriverUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Drivers.
     */
    data: XOR<DriverUpdateManyMutationInput, DriverUncheckedUpdateManyInput>
    /**
     * Filter which Drivers to update
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to update.
     */
    limit?: number
  }

  /**
   * Driver updateManyAndReturn
   */
  export type DriverUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * The data used to update Drivers.
     */
    data: XOR<DriverUpdateManyMutationInput, DriverUncheckedUpdateManyInput>
    /**
     * Filter which Drivers to update
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to update.
     */
    limit?: number
  }

  /**
   * Driver upsert
   */
  export type DriverUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * The filter to search for the Driver to update in case it exists.
     */
    where: DriverWhereUniqueInput
    /**
     * In case the Driver found by the `where` argument doesn't exist, create a new Driver with this data.
     */
    create: XOR<DriverCreateInput, DriverUncheckedCreateInput>
    /**
     * In case the Driver was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriverUpdateInput, DriverUncheckedUpdateInput>
  }

  /**
   * Driver delete
   */
  export type DriverDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    /**
     * Filter which Driver to delete.
     */
    where: DriverWhereUniqueInput
  }

  /**
   * Driver deleteMany
   */
  export type DriverDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Drivers to delete
     */
    where?: DriverWhereInput
    /**
     * Limit how many Drivers to delete.
     */
    limit?: number
  }

  /**
   * Driver.assignedVehicle
   */
  export type Driver$assignedVehicleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    where?: VehicleWhereInput
  }

  /**
   * Driver.reports
   */
  export type Driver$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    where?: DriverReportWhereInput
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    cursor?: DriverReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriverReportScalarFieldEnum | DriverReportScalarFieldEnum[]
  }

  /**
   * Driver.partsExchanges
   */
  export type Driver$partsExchangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    where?: PartsExchangeWhereInput
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    cursor?: PartsExchangeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PartsExchangeScalarFieldEnum | PartsExchangeScalarFieldEnum[]
  }

  /**
   * Driver.salesRecords
   */
  export type Driver$salesRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    where?: SalesRecordWhereInput
    orderBy?: SalesRecordOrderByWithRelationInput | SalesRecordOrderByWithRelationInput[]
    cursor?: SalesRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SalesRecordScalarFieldEnum | SalesRecordScalarFieldEnum[]
  }

  /**
   * Driver.ledgerEntries
   */
  export type Driver$ledgerEntriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    cursor?: LedgerEntryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * Driver.applicationRef
   */
  export type Driver$applicationRefArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    where?: ApplicationWhereInput
  }

  /**
   * Driver.sentMessages
   */
  export type Driver$sentMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Driver.conversations1
   */
  export type Driver$conversations1Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    where?: ChatConversationWhereInput
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    cursor?: ChatConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * Driver.conversations2
   */
  export type Driver$conversations2Args<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    where?: ChatConversationWhereInput
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    cursor?: ChatConversationWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * Driver without action
   */
  export type DriverDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
  }


  /**
   * Model Vehicle
   */

  export type AggregateVehicle = {
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  export type VehicleAvgAggregateOutputType = {
    year: number | null
  }

  export type VehicleSumAggregateOutputType = {
    year: number | null
  }

  export type VehicleMinAggregateOutputType = {
    id: string | null
    plateNumber: string | null
    make: string | null
    model: string | null
    year: number | null
    severityStatus: string | null
    gpsDeviceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    assignedDriverId: string | null
  }

  export type VehicleMaxAggregateOutputType = {
    id: string | null
    plateNumber: string | null
    make: string | null
    model: string | null
    year: number | null
    severityStatus: string | null
    gpsDeviceId: string | null
    createdAt: Date | null
    updatedAt: Date | null
    assignedDriverId: string | null
  }

  export type VehicleCountAggregateOutputType = {
    id: number
    plateNumber: number
    make: number
    model: number
    year: number
    severityStatus: number
    gpsDeviceId: number
    createdAt: number
    updatedAt: number
    assignedDriverId: number
    _all: number
  }


  export type VehicleAvgAggregateInputType = {
    year?: true
  }

  export type VehicleSumAggregateInputType = {
    year?: true
  }

  export type VehicleMinAggregateInputType = {
    id?: true
    plateNumber?: true
    make?: true
    model?: true
    year?: true
    severityStatus?: true
    gpsDeviceId?: true
    createdAt?: true
    updatedAt?: true
    assignedDriverId?: true
  }

  export type VehicleMaxAggregateInputType = {
    id?: true
    plateNumber?: true
    make?: true
    model?: true
    year?: true
    severityStatus?: true
    gpsDeviceId?: true
    createdAt?: true
    updatedAt?: true
    assignedDriverId?: true
  }

  export type VehicleCountAggregateInputType = {
    id?: true
    plateNumber?: true
    make?: true
    model?: true
    year?: true
    severityStatus?: true
    gpsDeviceId?: true
    createdAt?: true
    updatedAt?: true
    assignedDriverId?: true
    _all?: true
  }

  export type VehicleAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicle to aggregate.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Vehicles
    **/
    _count?: true | VehicleCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: VehicleAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: VehicleSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: VehicleMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: VehicleMaxAggregateInputType
  }

  export type GetVehicleAggregateType<T extends VehicleAggregateArgs> = {
        [P in keyof T & keyof AggregateVehicle]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVehicle[P]>
      : GetScalarType<T[P], AggregateVehicle[P]>
  }




  export type VehicleGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: VehicleWhereInput
    orderBy?: VehicleOrderByWithAggregationInput | VehicleOrderByWithAggregationInput[]
    by: VehicleScalarFieldEnum[] | VehicleScalarFieldEnum
    having?: VehicleScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: VehicleCountAggregateInputType | true
    _avg?: VehicleAvgAggregateInputType
    _sum?: VehicleSumAggregateInputType
    _min?: VehicleMinAggregateInputType
    _max?: VehicleMaxAggregateInputType
  }

  export type VehicleGroupByOutputType = {
    id: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus: string
    gpsDeviceId: string | null
    createdAt: Date
    updatedAt: Date
    assignedDriverId: string | null
    _count: VehicleCountAggregateOutputType | null
    _avg: VehicleAvgAggregateOutputType | null
    _sum: VehicleSumAggregateOutputType | null
    _min: VehicleMinAggregateOutputType | null
    _max: VehicleMaxAggregateOutputType | null
  }

  type GetVehicleGroupByPayload<T extends VehicleGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<VehicleGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof VehicleGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], VehicleGroupByOutputType[P]>
            : GetScalarType<T[P], VehicleGroupByOutputType[P]>
        }
      >
    >


  export type VehicleSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plateNumber?: boolean
    make?: boolean
    model?: boolean
    year?: boolean
    severityStatus?: boolean
    gpsDeviceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignedDriverId?: boolean
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
    reports?: boolean | Vehicle$reportsArgs<ExtArgs>
    partsExchanges?: boolean | Vehicle$partsExchangesArgs<ExtArgs>
    locationPings?: boolean | Vehicle$locationPingsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plateNumber?: boolean
    make?: boolean
    model?: boolean
    year?: boolean
    severityStatus?: boolean
    gpsDeviceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignedDriverId?: boolean
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    plateNumber?: boolean
    make?: boolean
    model?: boolean
    year?: boolean
    severityStatus?: boolean
    gpsDeviceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignedDriverId?: boolean
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
  }, ExtArgs["result"]["vehicle"]>

  export type VehicleSelectScalar = {
    id?: boolean
    plateNumber?: boolean
    make?: boolean
    model?: boolean
    year?: boolean
    severityStatus?: boolean
    gpsDeviceId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    assignedDriverId?: boolean
  }

  export type VehicleOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "plateNumber" | "make" | "model" | "year" | "severityStatus" | "gpsDeviceId" | "createdAt" | "updatedAt" | "assignedDriverId", ExtArgs["result"]["vehicle"]>
  export type VehicleInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
    reports?: boolean | Vehicle$reportsArgs<ExtArgs>
    partsExchanges?: boolean | Vehicle$partsExchangesArgs<ExtArgs>
    locationPings?: boolean | Vehicle$locationPingsArgs<ExtArgs>
    _count?: boolean | VehicleCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type VehicleIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
  }
  export type VehicleIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    assignedDriver?: boolean | Vehicle$assignedDriverArgs<ExtArgs>
  }

  export type $VehiclePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Vehicle"
    objects: {
      assignedDriver: Prisma.$DriverPayload<ExtArgs> | null
      reports: Prisma.$DriverReportPayload<ExtArgs>[]
      partsExchanges: Prisma.$PartsExchangePayload<ExtArgs>[]
      locationPings: Prisma.$LocationPingPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      plateNumber: string
      make: string
      model: string
      year: number
      severityStatus: string
      gpsDeviceId: string | null
      createdAt: Date
      updatedAt: Date
      assignedDriverId: string | null
    }, ExtArgs["result"]["vehicle"]>
    composites: {}
  }

  type VehicleGetPayload<S extends boolean | null | undefined | VehicleDefaultArgs> = $Result.GetResult<Prisma.$VehiclePayload, S>

  type VehicleCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<VehicleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: VehicleCountAggregateInputType | true
    }

  export interface VehicleDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Vehicle'], meta: { name: 'Vehicle' } }
    /**
     * Find zero or one Vehicle that matches the filter.
     * @param {VehicleFindUniqueArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends VehicleFindUniqueArgs>(args: SelectSubset<T, VehicleFindUniqueArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Vehicle that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {VehicleFindUniqueOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends VehicleFindUniqueOrThrowArgs>(args: SelectSubset<T, VehicleFindUniqueOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends VehicleFindFirstArgs>(args?: SelectSubset<T, VehicleFindFirstArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Vehicle that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindFirstOrThrowArgs} args - Arguments to find a Vehicle
     * @example
     * // Get one Vehicle
     * const vehicle = await prisma.vehicle.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends VehicleFindFirstOrThrowArgs>(args?: SelectSubset<T, VehicleFindFirstOrThrowArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Vehicles that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Vehicles
     * const vehicles = await prisma.vehicle.findMany()
     * 
     * // Get first 10 Vehicles
     * const vehicles = await prisma.vehicle.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends VehicleFindManyArgs>(args?: SelectSubset<T, VehicleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Vehicle.
     * @param {VehicleCreateArgs} args - Arguments to create a Vehicle.
     * @example
     * // Create one Vehicle
     * const Vehicle = await prisma.vehicle.create({
     *   data: {
     *     // ... data to create a Vehicle
     *   }
     * })
     * 
     */
    create<T extends VehicleCreateArgs>(args: SelectSubset<T, VehicleCreateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Vehicles.
     * @param {VehicleCreateManyArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends VehicleCreateManyArgs>(args?: SelectSubset<T, VehicleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Vehicles and returns the data saved in the database.
     * @param {VehicleCreateManyAndReturnArgs} args - Arguments to create many Vehicles.
     * @example
     * // Create many Vehicles
     * const vehicle = await prisma.vehicle.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends VehicleCreateManyAndReturnArgs>(args?: SelectSubset<T, VehicleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Vehicle.
     * @param {VehicleDeleteArgs} args - Arguments to delete one Vehicle.
     * @example
     * // Delete one Vehicle
     * const Vehicle = await prisma.vehicle.delete({
     *   where: {
     *     // ... filter to delete one Vehicle
     *   }
     * })
     * 
     */
    delete<T extends VehicleDeleteArgs>(args: SelectSubset<T, VehicleDeleteArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Vehicle.
     * @param {VehicleUpdateArgs} args - Arguments to update one Vehicle.
     * @example
     * // Update one Vehicle
     * const vehicle = await prisma.vehicle.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends VehicleUpdateArgs>(args: SelectSubset<T, VehicleUpdateArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Vehicles.
     * @param {VehicleDeleteManyArgs} args - Arguments to filter Vehicles to delete.
     * @example
     * // Delete a few Vehicles
     * const { count } = await prisma.vehicle.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends VehicleDeleteManyArgs>(args?: SelectSubset<T, VehicleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends VehicleUpdateManyArgs>(args: SelectSubset<T, VehicleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Vehicles and returns the data updated in the database.
     * @param {VehicleUpdateManyAndReturnArgs} args - Arguments to update many Vehicles.
     * @example
     * // Update many Vehicles
     * const vehicle = await prisma.vehicle.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Vehicles and only return the `id`
     * const vehicleWithIdOnly = await prisma.vehicle.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends VehicleUpdateManyAndReturnArgs>(args: SelectSubset<T, VehicleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Vehicle.
     * @param {VehicleUpsertArgs} args - Arguments to update or create a Vehicle.
     * @example
     * // Update or create a Vehicle
     * const vehicle = await prisma.vehicle.upsert({
     *   create: {
     *     // ... data to create a Vehicle
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Vehicle we want to update
     *   }
     * })
     */
    upsert<T extends VehicleUpsertArgs>(args: SelectSubset<T, VehicleUpsertArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Vehicles.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleCountArgs} args - Arguments to filter Vehicles to count.
     * @example
     * // Count the number of Vehicles
     * const count = await prisma.vehicle.count({
     *   where: {
     *     // ... the filter for the Vehicles we want to count
     *   }
     * })
    **/
    count<T extends VehicleCountArgs>(
      args?: Subset<T, VehicleCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], VehicleCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends VehicleAggregateArgs>(args: Subset<T, VehicleAggregateArgs>): Prisma.PrismaPromise<GetVehicleAggregateType<T>>

    /**
     * Group by Vehicle.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {VehicleGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends VehicleGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: VehicleGroupByArgs['orderBy'] }
        : { orderBy?: VehicleGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, VehicleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVehicleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Vehicle model
   */
  readonly fields: VehicleFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Vehicle.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__VehicleClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    assignedDriver<T extends Vehicle$assignedDriverArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$assignedDriverArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    reports<T extends Vehicle$reportsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$reportsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    partsExchanges<T extends Vehicle$partsExchangesArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$partsExchangesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    locationPings<T extends Vehicle$locationPingsArgs<ExtArgs> = {}>(args?: Subset<T, Vehicle$locationPingsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Vehicle model
   */
  interface VehicleFieldRefs {
    readonly id: FieldRef<"Vehicle", 'String'>
    readonly plateNumber: FieldRef<"Vehicle", 'String'>
    readonly make: FieldRef<"Vehicle", 'String'>
    readonly model: FieldRef<"Vehicle", 'String'>
    readonly year: FieldRef<"Vehicle", 'Int'>
    readonly severityStatus: FieldRef<"Vehicle", 'String'>
    readonly gpsDeviceId: FieldRef<"Vehicle", 'String'>
    readonly createdAt: FieldRef<"Vehicle", 'DateTime'>
    readonly updatedAt: FieldRef<"Vehicle", 'DateTime'>
    readonly assignedDriverId: FieldRef<"Vehicle", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Vehicle findUnique
   */
  export type VehicleFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findUniqueOrThrow
   */
  export type VehicleFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle findFirst
   */
  export type VehicleFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findFirstOrThrow
   */
  export type VehicleFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicle to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle findMany
   */
  export type VehicleFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter, which Vehicles to fetch.
     */
    where?: VehicleWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Vehicles to fetch.
     */
    orderBy?: VehicleOrderByWithRelationInput | VehicleOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Vehicles.
     */
    cursor?: VehicleWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Vehicles from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Vehicles.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Vehicles.
     */
    distinct?: VehicleScalarFieldEnum | VehicleScalarFieldEnum[]
  }

  /**
   * Vehicle create
   */
  export type VehicleCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to create a Vehicle.
     */
    data: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
  }

  /**
   * Vehicle createMany
   */
  export type VehicleCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
  }

  /**
   * Vehicle createManyAndReturn
   */
  export type VehicleCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to create many Vehicles.
     */
    data: VehicleCreateManyInput | VehicleCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vehicle update
   */
  export type VehicleUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The data needed to update a Vehicle.
     */
    data: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
    /**
     * Choose, which Vehicle to update.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle updateMany
   */
  export type VehicleUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
  }

  /**
   * Vehicle updateManyAndReturn
   */
  export type VehicleUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * The data used to update Vehicles.
     */
    data: XOR<VehicleUpdateManyMutationInput, VehicleUncheckedUpdateManyInput>
    /**
     * Filter which Vehicles to update
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Vehicle upsert
   */
  export type VehicleUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * The filter to search for the Vehicle to update in case it exists.
     */
    where: VehicleWhereUniqueInput
    /**
     * In case the Vehicle found by the `where` argument doesn't exist, create a new Vehicle with this data.
     */
    create: XOR<VehicleCreateInput, VehicleUncheckedCreateInput>
    /**
     * In case the Vehicle was found with the provided `where` argument, update it with this data.
     */
    update: XOR<VehicleUpdateInput, VehicleUncheckedUpdateInput>
  }

  /**
   * Vehicle delete
   */
  export type VehicleDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    /**
     * Filter which Vehicle to delete.
     */
    where: VehicleWhereUniqueInput
  }

  /**
   * Vehicle deleteMany
   */
  export type VehicleDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Vehicles to delete
     */
    where?: VehicleWhereInput
    /**
     * Limit how many Vehicles to delete.
     */
    limit?: number
  }

  /**
   * Vehicle.assignedDriver
   */
  export type Vehicle$assignedDriverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    where?: DriverWhereInput
  }

  /**
   * Vehicle.reports
   */
  export type Vehicle$reportsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    where?: DriverReportWhereInput
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    cursor?: DriverReportWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DriverReportScalarFieldEnum | DriverReportScalarFieldEnum[]
  }

  /**
   * Vehicle.partsExchanges
   */
  export type Vehicle$partsExchangesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    where?: PartsExchangeWhereInput
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    cursor?: PartsExchangeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PartsExchangeScalarFieldEnum | PartsExchangeScalarFieldEnum[]
  }

  /**
   * Vehicle.locationPings
   */
  export type Vehicle$locationPingsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    where?: LocationPingWhereInput
    orderBy?: LocationPingOrderByWithRelationInput | LocationPingOrderByWithRelationInput[]
    cursor?: LocationPingWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LocationPingScalarFieldEnum | LocationPingScalarFieldEnum[]
  }

  /**
   * Vehicle without action
   */
  export type VehicleDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
  }


  /**
   * Model Application
   */

  export type AggregateApplication = {
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  export type ApplicationMinAggregateOutputType = {
    id: string | null
    fullName: string | null
    phone: string | null
    email: string | null
    reason: string | null
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    approvedDriverId: string | null
  }

  export type ApplicationMaxAggregateOutputType = {
    id: string | null
    fullName: string | null
    phone: string | null
    email: string | null
    reason: string | null
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    approvedDriverId: string | null
  }

  export type ApplicationCountAggregateOutputType = {
    id: number
    fullName: number
    phone: number
    email: number
    reason: number
    licenseDocUrl: number
    ghanaCardUrl: number
    irisScanUrl: number
    status: number
    createdAt: number
    updatedAt: number
    approvedDriverId: number
    _all: number
  }


  export type ApplicationMinAggregateInputType = {
    id?: true
    fullName?: true
    phone?: true
    email?: true
    reason?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    approvedDriverId?: true
  }

  export type ApplicationMaxAggregateInputType = {
    id?: true
    fullName?: true
    phone?: true
    email?: true
    reason?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    approvedDriverId?: true
  }

  export type ApplicationCountAggregateInputType = {
    id?: true
    fullName?: true
    phone?: true
    email?: true
    reason?: true
    licenseDocUrl?: true
    ghanaCardUrl?: true
    irisScanUrl?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    approvedDriverId?: true
    _all?: true
  }

  export type ApplicationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Application to aggregate.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Applications
    **/
    _count?: true | ApplicationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApplicationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApplicationMaxAggregateInputType
  }

  export type GetApplicationAggregateType<T extends ApplicationAggregateArgs> = {
        [P in keyof T & keyof AggregateApplication]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApplication[P]>
      : GetScalarType<T[P], AggregateApplication[P]>
  }




  export type ApplicationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApplicationWhereInput
    orderBy?: ApplicationOrderByWithAggregationInput | ApplicationOrderByWithAggregationInput[]
    by: ApplicationScalarFieldEnum[] | ApplicationScalarFieldEnum
    having?: ApplicationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApplicationCountAggregateInputType | true
    _min?: ApplicationMinAggregateInputType
    _max?: ApplicationMaxAggregateInputType
  }

  export type ApplicationGroupByOutputType = {
    id: string
    fullName: string
    phone: string
    email: string | null
    reason: string
    licenseDocUrl: string | null
    ghanaCardUrl: string | null
    irisScanUrl: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    approvedDriverId: string | null
    _count: ApplicationCountAggregateOutputType | null
    _min: ApplicationMinAggregateOutputType | null
    _max: ApplicationMaxAggregateOutputType | null
  }

  type GetApplicationGroupByPayload<T extends ApplicationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApplicationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApplicationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
            : GetScalarType<T[P], ApplicationGroupByOutputType[P]>
        }
      >
    >


  export type ApplicationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    phone?: boolean
    email?: boolean
    reason?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedDriverId?: boolean
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    phone?: boolean
    email?: boolean
    reason?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedDriverId?: boolean
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fullName?: boolean
    phone?: boolean
    email?: boolean
    reason?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedDriverId?: boolean
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }, ExtArgs["result"]["application"]>

  export type ApplicationSelectScalar = {
    id?: boolean
    fullName?: boolean
    phone?: boolean
    email?: boolean
    reason?: boolean
    licenseDocUrl?: boolean
    ghanaCardUrl?: boolean
    irisScanUrl?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    approvedDriverId?: boolean
  }

  export type ApplicationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fullName" | "phone" | "email" | "reason" | "licenseDocUrl" | "ghanaCardUrl" | "irisScanUrl" | "status" | "createdAt" | "updatedAt" | "approvedDriverId", ExtArgs["result"]["application"]>
  export type ApplicationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }
  export type ApplicationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }
  export type ApplicationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    approvedDriver?: boolean | Application$approvedDriverArgs<ExtArgs>
  }

  export type $ApplicationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Application"
    objects: {
      approvedDriver: Prisma.$DriverPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fullName: string
      phone: string
      email: string | null
      reason: string
      licenseDocUrl: string | null
      ghanaCardUrl: string | null
      irisScanUrl: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      approvedDriverId: string | null
    }, ExtArgs["result"]["application"]>
    composites: {}
  }

  type ApplicationGetPayload<S extends boolean | null | undefined | ApplicationDefaultArgs> = $Result.GetResult<Prisma.$ApplicationPayload, S>

  type ApplicationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApplicationCountAggregateInputType | true
    }

  export interface ApplicationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Application'], meta: { name: 'Application' } }
    /**
     * Find zero or one Application that matches the filter.
     * @param {ApplicationFindUniqueArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApplicationFindUniqueArgs>(args: SelectSubset<T, ApplicationFindUniqueArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Application that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApplicationFindUniqueOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApplicationFindUniqueOrThrowArgs>(args: SelectSubset<T, ApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApplicationFindFirstArgs>(args?: SelectSubset<T, ApplicationFindFirstArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Application that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindFirstOrThrowArgs} args - Arguments to find a Application
     * @example
     * // Get one Application
     * const application = await prisma.application.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApplicationFindFirstOrThrowArgs>(args?: SelectSubset<T, ApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Applications that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Applications
     * const applications = await prisma.application.findMany()
     * 
     * // Get first 10 Applications
     * const applications = await prisma.application.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const applicationWithIdOnly = await prisma.application.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApplicationFindManyArgs>(args?: SelectSubset<T, ApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Application.
     * @param {ApplicationCreateArgs} args - Arguments to create a Application.
     * @example
     * // Create one Application
     * const Application = await prisma.application.create({
     *   data: {
     *     // ... data to create a Application
     *   }
     * })
     * 
     */
    create<T extends ApplicationCreateArgs>(args: SelectSubset<T, ApplicationCreateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Applications.
     * @param {ApplicationCreateManyArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApplicationCreateManyArgs>(args?: SelectSubset<T, ApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Applications and returns the data saved in the database.
     * @param {ApplicationCreateManyAndReturnArgs} args - Arguments to create many Applications.
     * @example
     * // Create many Applications
     * const application = await prisma.application.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApplicationCreateManyAndReturnArgs>(args?: SelectSubset<T, ApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Application.
     * @param {ApplicationDeleteArgs} args - Arguments to delete one Application.
     * @example
     * // Delete one Application
     * const Application = await prisma.application.delete({
     *   where: {
     *     // ... filter to delete one Application
     *   }
     * })
     * 
     */
    delete<T extends ApplicationDeleteArgs>(args: SelectSubset<T, ApplicationDeleteArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Application.
     * @param {ApplicationUpdateArgs} args - Arguments to update one Application.
     * @example
     * // Update one Application
     * const application = await prisma.application.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApplicationUpdateArgs>(args: SelectSubset<T, ApplicationUpdateArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Applications.
     * @param {ApplicationDeleteManyArgs} args - Arguments to filter Applications to delete.
     * @example
     * // Delete a few Applications
     * const { count } = await prisma.application.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApplicationDeleteManyArgs>(args?: SelectSubset<T, ApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApplicationUpdateManyArgs>(args: SelectSubset<T, ApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Applications and returns the data updated in the database.
     * @param {ApplicationUpdateManyAndReturnArgs} args - Arguments to update many Applications.
     * @example
     * // Update many Applications
     * const application = await prisma.application.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Applications and only return the `id`
     * const applicationWithIdOnly = await prisma.application.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApplicationUpdateManyAndReturnArgs>(args: SelectSubset<T, ApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Application.
     * @param {ApplicationUpsertArgs} args - Arguments to update or create a Application.
     * @example
     * // Update or create a Application
     * const application = await prisma.application.upsert({
     *   create: {
     *     // ... data to create a Application
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Application we want to update
     *   }
     * })
     */
    upsert<T extends ApplicationUpsertArgs>(args: SelectSubset<T, ApplicationUpsertArgs<ExtArgs>>): Prisma__ApplicationClient<$Result.GetResult<Prisma.$ApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Applications.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationCountArgs} args - Arguments to filter Applications to count.
     * @example
     * // Count the number of Applications
     * const count = await prisma.application.count({
     *   where: {
     *     // ... the filter for the Applications we want to count
     *   }
     * })
    **/
    count<T extends ApplicationCountArgs>(
      args?: Subset<T, ApplicationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApplicationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApplicationAggregateArgs>(args: Subset<T, ApplicationAggregateArgs>): Prisma.PrismaPromise<GetApplicationAggregateType<T>>

    /**
     * Group by Application.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApplicationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApplicationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApplicationGroupByArgs['orderBy'] }
        : { orderBy?: ApplicationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Application model
   */
  readonly fields: ApplicationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Application.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApplicationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    approvedDriver<T extends Application$approvedDriverArgs<ExtArgs> = {}>(args?: Subset<T, Application$approvedDriverArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Application model
   */
  interface ApplicationFieldRefs {
    readonly id: FieldRef<"Application", 'String'>
    readonly fullName: FieldRef<"Application", 'String'>
    readonly phone: FieldRef<"Application", 'String'>
    readonly email: FieldRef<"Application", 'String'>
    readonly reason: FieldRef<"Application", 'String'>
    readonly licenseDocUrl: FieldRef<"Application", 'String'>
    readonly ghanaCardUrl: FieldRef<"Application", 'String'>
    readonly irisScanUrl: FieldRef<"Application", 'String'>
    readonly status: FieldRef<"Application", 'String'>
    readonly createdAt: FieldRef<"Application", 'DateTime'>
    readonly updatedAt: FieldRef<"Application", 'DateTime'>
    readonly approvedDriverId: FieldRef<"Application", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Application findUnique
   */
  export type ApplicationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findUniqueOrThrow
   */
  export type ApplicationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application findFirst
   */
  export type ApplicationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findFirstOrThrow
   */
  export type ApplicationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Application to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application findMany
   */
  export type ApplicationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter, which Applications to fetch.
     */
    where?: ApplicationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Applications to fetch.
     */
    orderBy?: ApplicationOrderByWithRelationInput | ApplicationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Applications.
     */
    cursor?: ApplicationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Applications from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Applications.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Applications.
     */
    distinct?: ApplicationScalarFieldEnum | ApplicationScalarFieldEnum[]
  }

  /**
   * Application create
   */
  export type ApplicationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to create a Application.
     */
    data: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
  }

  /**
   * Application createMany
   */
  export type ApplicationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
  }

  /**
   * Application createManyAndReturn
   */
  export type ApplicationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to create many Applications.
     */
    data: ApplicationCreateManyInput | ApplicationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application update
   */
  export type ApplicationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The data needed to update a Application.
     */
    data: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
    /**
     * Choose, which Application to update.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application updateMany
   */
  export type ApplicationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
  }

  /**
   * Application updateManyAndReturn
   */
  export type ApplicationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * The data used to update Applications.
     */
    data: XOR<ApplicationUpdateManyMutationInput, ApplicationUncheckedUpdateManyInput>
    /**
     * Filter which Applications to update
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Application upsert
   */
  export type ApplicationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * The filter to search for the Application to update in case it exists.
     */
    where: ApplicationWhereUniqueInput
    /**
     * In case the Application found by the `where` argument doesn't exist, create a new Application with this data.
     */
    create: XOR<ApplicationCreateInput, ApplicationUncheckedCreateInput>
    /**
     * In case the Application was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApplicationUpdateInput, ApplicationUncheckedUpdateInput>
  }

  /**
   * Application delete
   */
  export type ApplicationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
    /**
     * Filter which Application to delete.
     */
    where: ApplicationWhereUniqueInput
  }

  /**
   * Application deleteMany
   */
  export type ApplicationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Applications to delete
     */
    where?: ApplicationWhereInput
    /**
     * Limit how many Applications to delete.
     */
    limit?: number
  }

  /**
   * Application.approvedDriver
   */
  export type Application$approvedDriverArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Driver
     */
    select?: DriverSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Driver
     */
    omit?: DriverOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverInclude<ExtArgs> | null
    where?: DriverWhereInput
  }

  /**
   * Application without action
   */
  export type ApplicationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Application
     */
    select?: ApplicationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Application
     */
    omit?: ApplicationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ApplicationInclude<ExtArgs> | null
  }


  /**
   * Model DriverReport
   */

  export type AggregateDriverReport = {
    _count: DriverReportCountAggregateOutputType | null
    _min: DriverReportMinAggregateOutputType | null
    _max: DriverReportMaxAggregateOutputType | null
  }

  export type DriverReportMinAggregateOutputType = {
    id: string | null
    type: string | null
    description: string | null
    photoUrl: string | null
    suggestedSeverity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
    vehicleId: string | null
  }

  export type DriverReportMaxAggregateOutputType = {
    id: string | null
    type: string | null
    description: string | null
    photoUrl: string | null
    suggestedSeverity: string | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
    vehicleId: string | null
  }

  export type DriverReportCountAggregateOutputType = {
    id: number
    type: number
    description: number
    photoUrl: number
    suggestedSeverity: number
    status: number
    createdAt: number
    updatedAt: number
    driverId: number
    vehicleId: number
    _all: number
  }


  export type DriverReportMinAggregateInputType = {
    id?: true
    type?: true
    description?: true
    photoUrl?: true
    suggestedSeverity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
  }

  export type DriverReportMaxAggregateInputType = {
    id?: true
    type?: true
    description?: true
    photoUrl?: true
    suggestedSeverity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
  }

  export type DriverReportCountAggregateInputType = {
    id?: true
    type?: true
    description?: true
    photoUrl?: true
    suggestedSeverity?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
    _all?: true
  }

  export type DriverReportAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriverReport to aggregate.
     */
    where?: DriverReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriverReports to fetch.
     */
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DriverReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriverReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriverReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DriverReports
    **/
    _count?: true | DriverReportCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DriverReportMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DriverReportMaxAggregateInputType
  }

  export type GetDriverReportAggregateType<T extends DriverReportAggregateArgs> = {
        [P in keyof T & keyof AggregateDriverReport]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDriverReport[P]>
      : GetScalarType<T[P], AggregateDriverReport[P]>
  }




  export type DriverReportGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DriverReportWhereInput
    orderBy?: DriverReportOrderByWithAggregationInput | DriverReportOrderByWithAggregationInput[]
    by: DriverReportScalarFieldEnum[] | DriverReportScalarFieldEnum
    having?: DriverReportScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DriverReportCountAggregateInputType | true
    _min?: DriverReportMinAggregateInputType
    _max?: DriverReportMaxAggregateInputType
  }

  export type DriverReportGroupByOutputType = {
    id: string
    type: string
    description: string
    photoUrl: string | null
    suggestedSeverity: string | null
    status: string
    createdAt: Date
    updatedAt: Date
    driverId: string
    vehicleId: string | null
    _count: DriverReportCountAggregateOutputType | null
    _min: DriverReportMinAggregateOutputType | null
    _max: DriverReportMaxAggregateOutputType | null
  }

  type GetDriverReportGroupByPayload<T extends DriverReportGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DriverReportGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DriverReportGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DriverReportGroupByOutputType[P]>
            : GetScalarType<T[P], DriverReportGroupByOutputType[P]>
        }
      >
    >


  export type DriverReportSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    description?: boolean
    photoUrl?: boolean
    suggestedSeverity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }, ExtArgs["result"]["driverReport"]>

  export type DriverReportSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    description?: boolean
    photoUrl?: boolean
    suggestedSeverity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }, ExtArgs["result"]["driverReport"]>

  export type DriverReportSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    type?: boolean
    description?: boolean
    photoUrl?: boolean
    suggestedSeverity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }, ExtArgs["result"]["driverReport"]>

  export type DriverReportSelectScalar = {
    id?: boolean
    type?: boolean
    description?: boolean
    photoUrl?: boolean
    suggestedSeverity?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
  }

  export type DriverReportOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "type" | "description" | "photoUrl" | "suggestedSeverity" | "status" | "createdAt" | "updatedAt" | "driverId" | "vehicleId", ExtArgs["result"]["driverReport"]>
  export type DriverReportInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }
  export type DriverReportIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }
  export type DriverReportIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | DriverReport$vehicleArgs<ExtArgs>
  }

  export type $DriverReportPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DriverReport"
    objects: {
      driver: Prisma.$DriverPayload<ExtArgs>
      vehicle: Prisma.$VehiclePayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      type: string
      description: string
      photoUrl: string | null
      suggestedSeverity: string | null
      status: string
      createdAt: Date
      updatedAt: Date
      driverId: string
      vehicleId: string | null
    }, ExtArgs["result"]["driverReport"]>
    composites: {}
  }

  type DriverReportGetPayload<S extends boolean | null | undefined | DriverReportDefaultArgs> = $Result.GetResult<Prisma.$DriverReportPayload, S>

  type DriverReportCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DriverReportFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DriverReportCountAggregateInputType | true
    }

  export interface DriverReportDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DriverReport'], meta: { name: 'DriverReport' } }
    /**
     * Find zero or one DriverReport that matches the filter.
     * @param {DriverReportFindUniqueArgs} args - Arguments to find a DriverReport
     * @example
     * // Get one DriverReport
     * const driverReport = await prisma.driverReport.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DriverReportFindUniqueArgs>(args: SelectSubset<T, DriverReportFindUniqueArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DriverReport that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DriverReportFindUniqueOrThrowArgs} args - Arguments to find a DriverReport
     * @example
     * // Get one DriverReport
     * const driverReport = await prisma.driverReport.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DriverReportFindUniqueOrThrowArgs>(args: SelectSubset<T, DriverReportFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriverReport that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportFindFirstArgs} args - Arguments to find a DriverReport
     * @example
     * // Get one DriverReport
     * const driverReport = await prisma.driverReport.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DriverReportFindFirstArgs>(args?: SelectSubset<T, DriverReportFindFirstArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DriverReport that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportFindFirstOrThrowArgs} args - Arguments to find a DriverReport
     * @example
     * // Get one DriverReport
     * const driverReport = await prisma.driverReport.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DriverReportFindFirstOrThrowArgs>(args?: SelectSubset<T, DriverReportFindFirstOrThrowArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DriverReports that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DriverReports
     * const driverReports = await prisma.driverReport.findMany()
     * 
     * // Get first 10 DriverReports
     * const driverReports = await prisma.driverReport.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const driverReportWithIdOnly = await prisma.driverReport.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DriverReportFindManyArgs>(args?: SelectSubset<T, DriverReportFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DriverReport.
     * @param {DriverReportCreateArgs} args - Arguments to create a DriverReport.
     * @example
     * // Create one DriverReport
     * const DriverReport = await prisma.driverReport.create({
     *   data: {
     *     // ... data to create a DriverReport
     *   }
     * })
     * 
     */
    create<T extends DriverReportCreateArgs>(args: SelectSubset<T, DriverReportCreateArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DriverReports.
     * @param {DriverReportCreateManyArgs} args - Arguments to create many DriverReports.
     * @example
     * // Create many DriverReports
     * const driverReport = await prisma.driverReport.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DriverReportCreateManyArgs>(args?: SelectSubset<T, DriverReportCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DriverReports and returns the data saved in the database.
     * @param {DriverReportCreateManyAndReturnArgs} args - Arguments to create many DriverReports.
     * @example
     * // Create many DriverReports
     * const driverReport = await prisma.driverReport.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DriverReports and only return the `id`
     * const driverReportWithIdOnly = await prisma.driverReport.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DriverReportCreateManyAndReturnArgs>(args?: SelectSubset<T, DriverReportCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DriverReport.
     * @param {DriverReportDeleteArgs} args - Arguments to delete one DriverReport.
     * @example
     * // Delete one DriverReport
     * const DriverReport = await prisma.driverReport.delete({
     *   where: {
     *     // ... filter to delete one DriverReport
     *   }
     * })
     * 
     */
    delete<T extends DriverReportDeleteArgs>(args: SelectSubset<T, DriverReportDeleteArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DriverReport.
     * @param {DriverReportUpdateArgs} args - Arguments to update one DriverReport.
     * @example
     * // Update one DriverReport
     * const driverReport = await prisma.driverReport.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DriverReportUpdateArgs>(args: SelectSubset<T, DriverReportUpdateArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DriverReports.
     * @param {DriverReportDeleteManyArgs} args - Arguments to filter DriverReports to delete.
     * @example
     * // Delete a few DriverReports
     * const { count } = await prisma.driverReport.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DriverReportDeleteManyArgs>(args?: SelectSubset<T, DriverReportDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriverReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DriverReports
     * const driverReport = await prisma.driverReport.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DriverReportUpdateManyArgs>(args: SelectSubset<T, DriverReportUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DriverReports and returns the data updated in the database.
     * @param {DriverReportUpdateManyAndReturnArgs} args - Arguments to update many DriverReports.
     * @example
     * // Update many DriverReports
     * const driverReport = await prisma.driverReport.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DriverReports and only return the `id`
     * const driverReportWithIdOnly = await prisma.driverReport.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DriverReportUpdateManyAndReturnArgs>(args: SelectSubset<T, DriverReportUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DriverReport.
     * @param {DriverReportUpsertArgs} args - Arguments to update or create a DriverReport.
     * @example
     * // Update or create a DriverReport
     * const driverReport = await prisma.driverReport.upsert({
     *   create: {
     *     // ... data to create a DriverReport
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DriverReport we want to update
     *   }
     * })
     */
    upsert<T extends DriverReportUpsertArgs>(args: SelectSubset<T, DriverReportUpsertArgs<ExtArgs>>): Prisma__DriverReportClient<$Result.GetResult<Prisma.$DriverReportPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DriverReports.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportCountArgs} args - Arguments to filter DriverReports to count.
     * @example
     * // Count the number of DriverReports
     * const count = await prisma.driverReport.count({
     *   where: {
     *     // ... the filter for the DriverReports we want to count
     *   }
     * })
    **/
    count<T extends DriverReportCountArgs>(
      args?: Subset<T, DriverReportCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DriverReportCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DriverReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DriverReportAggregateArgs>(args: Subset<T, DriverReportAggregateArgs>): Prisma.PrismaPromise<GetDriverReportAggregateType<T>>

    /**
     * Group by DriverReport.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DriverReportGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DriverReportGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DriverReportGroupByArgs['orderBy'] }
        : { orderBy?: DriverReportGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DriverReportGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDriverReportGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DriverReport model
   */
  readonly fields: DriverReportFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DriverReport.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DriverReportClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vehicle<T extends DriverReport$vehicleArgs<ExtArgs> = {}>(args?: Subset<T, DriverReport$vehicleArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DriverReport model
   */
  interface DriverReportFieldRefs {
    readonly id: FieldRef<"DriverReport", 'String'>
    readonly type: FieldRef<"DriverReport", 'String'>
    readonly description: FieldRef<"DriverReport", 'String'>
    readonly photoUrl: FieldRef<"DriverReport", 'String'>
    readonly suggestedSeverity: FieldRef<"DriverReport", 'String'>
    readonly status: FieldRef<"DriverReport", 'String'>
    readonly createdAt: FieldRef<"DriverReport", 'DateTime'>
    readonly updatedAt: FieldRef<"DriverReport", 'DateTime'>
    readonly driverId: FieldRef<"DriverReport", 'String'>
    readonly vehicleId: FieldRef<"DriverReport", 'String'>
  }
    

  // Custom InputTypes
  /**
   * DriverReport findUnique
   */
  export type DriverReportFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter, which DriverReport to fetch.
     */
    where: DriverReportWhereUniqueInput
  }

  /**
   * DriverReport findUniqueOrThrow
   */
  export type DriverReportFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter, which DriverReport to fetch.
     */
    where: DriverReportWhereUniqueInput
  }

  /**
   * DriverReport findFirst
   */
  export type DriverReportFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter, which DriverReport to fetch.
     */
    where?: DriverReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriverReports to fetch.
     */
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriverReports.
     */
    cursor?: DriverReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriverReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriverReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriverReports.
     */
    distinct?: DriverReportScalarFieldEnum | DriverReportScalarFieldEnum[]
  }

  /**
   * DriverReport findFirstOrThrow
   */
  export type DriverReportFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter, which DriverReport to fetch.
     */
    where?: DriverReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriverReports to fetch.
     */
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DriverReports.
     */
    cursor?: DriverReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriverReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriverReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriverReports.
     */
    distinct?: DriverReportScalarFieldEnum | DriverReportScalarFieldEnum[]
  }

  /**
   * DriverReport findMany
   */
  export type DriverReportFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter, which DriverReports to fetch.
     */
    where?: DriverReportWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DriverReports to fetch.
     */
    orderBy?: DriverReportOrderByWithRelationInput | DriverReportOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DriverReports.
     */
    cursor?: DriverReportWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DriverReports from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DriverReports.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DriverReports.
     */
    distinct?: DriverReportScalarFieldEnum | DriverReportScalarFieldEnum[]
  }

  /**
   * DriverReport create
   */
  export type DriverReportCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * The data needed to create a DriverReport.
     */
    data: XOR<DriverReportCreateInput, DriverReportUncheckedCreateInput>
  }

  /**
   * DriverReport createMany
   */
  export type DriverReportCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DriverReports.
     */
    data: DriverReportCreateManyInput | DriverReportCreateManyInput[]
  }

  /**
   * DriverReport createManyAndReturn
   */
  export type DriverReportCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * The data used to create many DriverReports.
     */
    data: DriverReportCreateManyInput | DriverReportCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriverReport update
   */
  export type DriverReportUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * The data needed to update a DriverReport.
     */
    data: XOR<DriverReportUpdateInput, DriverReportUncheckedUpdateInput>
    /**
     * Choose, which DriverReport to update.
     */
    where: DriverReportWhereUniqueInput
  }

  /**
   * DriverReport updateMany
   */
  export type DriverReportUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DriverReports.
     */
    data: XOR<DriverReportUpdateManyMutationInput, DriverReportUncheckedUpdateManyInput>
    /**
     * Filter which DriverReports to update
     */
    where?: DriverReportWhereInput
    /**
     * Limit how many DriverReports to update.
     */
    limit?: number
  }

  /**
   * DriverReport updateManyAndReturn
   */
  export type DriverReportUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * The data used to update DriverReports.
     */
    data: XOR<DriverReportUpdateManyMutationInput, DriverReportUncheckedUpdateManyInput>
    /**
     * Filter which DriverReports to update
     */
    where?: DriverReportWhereInput
    /**
     * Limit how many DriverReports to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DriverReport upsert
   */
  export type DriverReportUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * The filter to search for the DriverReport to update in case it exists.
     */
    where: DriverReportWhereUniqueInput
    /**
     * In case the DriverReport found by the `where` argument doesn't exist, create a new DriverReport with this data.
     */
    create: XOR<DriverReportCreateInput, DriverReportUncheckedCreateInput>
    /**
     * In case the DriverReport was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DriverReportUpdateInput, DriverReportUncheckedUpdateInput>
  }

  /**
   * DriverReport delete
   */
  export type DriverReportDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
    /**
     * Filter which DriverReport to delete.
     */
    where: DriverReportWhereUniqueInput
  }

  /**
   * DriverReport deleteMany
   */
  export type DriverReportDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DriverReports to delete
     */
    where?: DriverReportWhereInput
    /**
     * Limit how many DriverReports to delete.
     */
    limit?: number
  }

  /**
   * DriverReport.vehicle
   */
  export type DriverReport$vehicleArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Vehicle
     */
    select?: VehicleSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Vehicle
     */
    omit?: VehicleOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: VehicleInclude<ExtArgs> | null
    where?: VehicleWhereInput
  }

  /**
   * DriverReport without action
   */
  export type DriverReportDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DriverReport
     */
    select?: DriverReportSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DriverReport
     */
    omit?: DriverReportOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DriverReportInclude<ExtArgs> | null
  }


  /**
   * Model PartsExchange
   */

  export type AggregatePartsExchange = {
    _count: PartsExchangeCountAggregateOutputType | null
    _avg: PartsExchangeAvgAggregateOutputType | null
    _sum: PartsExchangeSumAggregateOutputType | null
    _min: PartsExchangeMinAggregateOutputType | null
    _max: PartsExchangeMaxAggregateOutputType | null
  }

  export type PartsExchangeAvgAggregateOutputType = {
    cost: number | null
  }

  export type PartsExchangeSumAggregateOutputType = {
    cost: number | null
  }

  export type PartsExchangeMinAggregateOutputType = {
    id: string | null
    partName: string | null
    cost: number | null
    date: Date | null
    photoUrl: string | null
    receiptUrl: string | null
    reimbursementStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
    vehicleId: string | null
  }

  export type PartsExchangeMaxAggregateOutputType = {
    id: string | null
    partName: string | null
    cost: number | null
    date: Date | null
    photoUrl: string | null
    receiptUrl: string | null
    reimbursementStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
    vehicleId: string | null
  }

  export type PartsExchangeCountAggregateOutputType = {
    id: number
    partName: number
    cost: number
    date: number
    photoUrl: number
    receiptUrl: number
    reimbursementStatus: number
    createdAt: number
    updatedAt: number
    driverId: number
    vehicleId: number
    _all: number
  }


  export type PartsExchangeAvgAggregateInputType = {
    cost?: true
  }

  export type PartsExchangeSumAggregateInputType = {
    cost?: true
  }

  export type PartsExchangeMinAggregateInputType = {
    id?: true
    partName?: true
    cost?: true
    date?: true
    photoUrl?: true
    receiptUrl?: true
    reimbursementStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
  }

  export type PartsExchangeMaxAggregateInputType = {
    id?: true
    partName?: true
    cost?: true
    date?: true
    photoUrl?: true
    receiptUrl?: true
    reimbursementStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
  }

  export type PartsExchangeCountAggregateInputType = {
    id?: true
    partName?: true
    cost?: true
    date?: true
    photoUrl?: true
    receiptUrl?: true
    reimbursementStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    vehicleId?: true
    _all?: true
  }

  export type PartsExchangeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PartsExchange to aggregate.
     */
    where?: PartsExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartsExchanges to fetch.
     */
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PartsExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartsExchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartsExchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PartsExchanges
    **/
    _count?: true | PartsExchangeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PartsExchangeAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PartsExchangeSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PartsExchangeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PartsExchangeMaxAggregateInputType
  }

  export type GetPartsExchangeAggregateType<T extends PartsExchangeAggregateArgs> = {
        [P in keyof T & keyof AggregatePartsExchange]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePartsExchange[P]>
      : GetScalarType<T[P], AggregatePartsExchange[P]>
  }




  export type PartsExchangeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PartsExchangeWhereInput
    orderBy?: PartsExchangeOrderByWithAggregationInput | PartsExchangeOrderByWithAggregationInput[]
    by: PartsExchangeScalarFieldEnum[] | PartsExchangeScalarFieldEnum
    having?: PartsExchangeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PartsExchangeCountAggregateInputType | true
    _avg?: PartsExchangeAvgAggregateInputType
    _sum?: PartsExchangeSumAggregateInputType
    _min?: PartsExchangeMinAggregateInputType
    _max?: PartsExchangeMaxAggregateInputType
  }

  export type PartsExchangeGroupByOutputType = {
    id: string
    partName: string
    cost: number
    date: Date
    photoUrl: string | null
    receiptUrl: string | null
    reimbursementStatus: string
    createdAt: Date
    updatedAt: Date
    driverId: string
    vehicleId: string
    _count: PartsExchangeCountAggregateOutputType | null
    _avg: PartsExchangeAvgAggregateOutputType | null
    _sum: PartsExchangeSumAggregateOutputType | null
    _min: PartsExchangeMinAggregateOutputType | null
    _max: PartsExchangeMaxAggregateOutputType | null
  }

  type GetPartsExchangeGroupByPayload<T extends PartsExchangeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PartsExchangeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PartsExchangeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PartsExchangeGroupByOutputType[P]>
            : GetScalarType<T[P], PartsExchangeGroupByOutputType[P]>
        }
      >
    >


  export type PartsExchangeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    partName?: boolean
    cost?: boolean
    date?: boolean
    photoUrl?: boolean
    receiptUrl?: boolean
    reimbursementStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partsExchange"]>

  export type PartsExchangeSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    partName?: boolean
    cost?: boolean
    date?: boolean
    photoUrl?: boolean
    receiptUrl?: boolean
    reimbursementStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partsExchange"]>

  export type PartsExchangeSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    partName?: boolean
    cost?: boolean
    date?: boolean
    photoUrl?: boolean
    receiptUrl?: boolean
    reimbursementStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["partsExchange"]>

  export type PartsExchangeSelectScalar = {
    id?: boolean
    partName?: boolean
    cost?: boolean
    date?: boolean
    photoUrl?: boolean
    receiptUrl?: boolean
    reimbursementStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    vehicleId?: boolean
  }

  export type PartsExchangeOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "partName" | "cost" | "date" | "photoUrl" | "receiptUrl" | "reimbursementStatus" | "createdAt" | "updatedAt" | "driverId" | "vehicleId", ExtArgs["result"]["partsExchange"]>
  export type PartsExchangeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type PartsExchangeIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type PartsExchangeIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $PartsExchangePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PartsExchange"
    objects: {
      driver: Prisma.$DriverPayload<ExtArgs>
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      partName: string
      cost: number
      date: Date
      photoUrl: string | null
      receiptUrl: string | null
      reimbursementStatus: string
      createdAt: Date
      updatedAt: Date
      driverId: string
      vehicleId: string
    }, ExtArgs["result"]["partsExchange"]>
    composites: {}
  }

  type PartsExchangeGetPayload<S extends boolean | null | undefined | PartsExchangeDefaultArgs> = $Result.GetResult<Prisma.$PartsExchangePayload, S>

  type PartsExchangeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PartsExchangeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PartsExchangeCountAggregateInputType | true
    }

  export interface PartsExchangeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PartsExchange'], meta: { name: 'PartsExchange' } }
    /**
     * Find zero or one PartsExchange that matches the filter.
     * @param {PartsExchangeFindUniqueArgs} args - Arguments to find a PartsExchange
     * @example
     * // Get one PartsExchange
     * const partsExchange = await prisma.partsExchange.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PartsExchangeFindUniqueArgs>(args: SelectSubset<T, PartsExchangeFindUniqueArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PartsExchange that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PartsExchangeFindUniqueOrThrowArgs} args - Arguments to find a PartsExchange
     * @example
     * // Get one PartsExchange
     * const partsExchange = await prisma.partsExchange.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PartsExchangeFindUniqueOrThrowArgs>(args: SelectSubset<T, PartsExchangeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PartsExchange that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeFindFirstArgs} args - Arguments to find a PartsExchange
     * @example
     * // Get one PartsExchange
     * const partsExchange = await prisma.partsExchange.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PartsExchangeFindFirstArgs>(args?: SelectSubset<T, PartsExchangeFindFirstArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PartsExchange that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeFindFirstOrThrowArgs} args - Arguments to find a PartsExchange
     * @example
     * // Get one PartsExchange
     * const partsExchange = await prisma.partsExchange.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PartsExchangeFindFirstOrThrowArgs>(args?: SelectSubset<T, PartsExchangeFindFirstOrThrowArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PartsExchanges that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PartsExchanges
     * const partsExchanges = await prisma.partsExchange.findMany()
     * 
     * // Get first 10 PartsExchanges
     * const partsExchanges = await prisma.partsExchange.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const partsExchangeWithIdOnly = await prisma.partsExchange.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PartsExchangeFindManyArgs>(args?: SelectSubset<T, PartsExchangeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PartsExchange.
     * @param {PartsExchangeCreateArgs} args - Arguments to create a PartsExchange.
     * @example
     * // Create one PartsExchange
     * const PartsExchange = await prisma.partsExchange.create({
     *   data: {
     *     // ... data to create a PartsExchange
     *   }
     * })
     * 
     */
    create<T extends PartsExchangeCreateArgs>(args: SelectSubset<T, PartsExchangeCreateArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PartsExchanges.
     * @param {PartsExchangeCreateManyArgs} args - Arguments to create many PartsExchanges.
     * @example
     * // Create many PartsExchanges
     * const partsExchange = await prisma.partsExchange.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PartsExchangeCreateManyArgs>(args?: SelectSubset<T, PartsExchangeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PartsExchanges and returns the data saved in the database.
     * @param {PartsExchangeCreateManyAndReturnArgs} args - Arguments to create many PartsExchanges.
     * @example
     * // Create many PartsExchanges
     * const partsExchange = await prisma.partsExchange.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PartsExchanges and only return the `id`
     * const partsExchangeWithIdOnly = await prisma.partsExchange.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PartsExchangeCreateManyAndReturnArgs>(args?: SelectSubset<T, PartsExchangeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PartsExchange.
     * @param {PartsExchangeDeleteArgs} args - Arguments to delete one PartsExchange.
     * @example
     * // Delete one PartsExchange
     * const PartsExchange = await prisma.partsExchange.delete({
     *   where: {
     *     // ... filter to delete one PartsExchange
     *   }
     * })
     * 
     */
    delete<T extends PartsExchangeDeleteArgs>(args: SelectSubset<T, PartsExchangeDeleteArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PartsExchange.
     * @param {PartsExchangeUpdateArgs} args - Arguments to update one PartsExchange.
     * @example
     * // Update one PartsExchange
     * const partsExchange = await prisma.partsExchange.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PartsExchangeUpdateArgs>(args: SelectSubset<T, PartsExchangeUpdateArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PartsExchanges.
     * @param {PartsExchangeDeleteManyArgs} args - Arguments to filter PartsExchanges to delete.
     * @example
     * // Delete a few PartsExchanges
     * const { count } = await prisma.partsExchange.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PartsExchangeDeleteManyArgs>(args?: SelectSubset<T, PartsExchangeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PartsExchanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PartsExchanges
     * const partsExchange = await prisma.partsExchange.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PartsExchangeUpdateManyArgs>(args: SelectSubset<T, PartsExchangeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PartsExchanges and returns the data updated in the database.
     * @param {PartsExchangeUpdateManyAndReturnArgs} args - Arguments to update many PartsExchanges.
     * @example
     * // Update many PartsExchanges
     * const partsExchange = await prisma.partsExchange.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PartsExchanges and only return the `id`
     * const partsExchangeWithIdOnly = await prisma.partsExchange.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PartsExchangeUpdateManyAndReturnArgs>(args: SelectSubset<T, PartsExchangeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PartsExchange.
     * @param {PartsExchangeUpsertArgs} args - Arguments to update or create a PartsExchange.
     * @example
     * // Update or create a PartsExchange
     * const partsExchange = await prisma.partsExchange.upsert({
     *   create: {
     *     // ... data to create a PartsExchange
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PartsExchange we want to update
     *   }
     * })
     */
    upsert<T extends PartsExchangeUpsertArgs>(args: SelectSubset<T, PartsExchangeUpsertArgs<ExtArgs>>): Prisma__PartsExchangeClient<$Result.GetResult<Prisma.$PartsExchangePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PartsExchanges.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeCountArgs} args - Arguments to filter PartsExchanges to count.
     * @example
     * // Count the number of PartsExchanges
     * const count = await prisma.partsExchange.count({
     *   where: {
     *     // ... the filter for the PartsExchanges we want to count
     *   }
     * })
    **/
    count<T extends PartsExchangeCountArgs>(
      args?: Subset<T, PartsExchangeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PartsExchangeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PartsExchange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PartsExchangeAggregateArgs>(args: Subset<T, PartsExchangeAggregateArgs>): Prisma.PrismaPromise<GetPartsExchangeAggregateType<T>>

    /**
     * Group by PartsExchange.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PartsExchangeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PartsExchangeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PartsExchangeGroupByArgs['orderBy'] }
        : { orderBy?: PartsExchangeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PartsExchangeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPartsExchangeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PartsExchange model
   */
  readonly fields: PartsExchangeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PartsExchange.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PartsExchangeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PartsExchange model
   */
  interface PartsExchangeFieldRefs {
    readonly id: FieldRef<"PartsExchange", 'String'>
    readonly partName: FieldRef<"PartsExchange", 'String'>
    readonly cost: FieldRef<"PartsExchange", 'Float'>
    readonly date: FieldRef<"PartsExchange", 'DateTime'>
    readonly photoUrl: FieldRef<"PartsExchange", 'String'>
    readonly receiptUrl: FieldRef<"PartsExchange", 'String'>
    readonly reimbursementStatus: FieldRef<"PartsExchange", 'String'>
    readonly createdAt: FieldRef<"PartsExchange", 'DateTime'>
    readonly updatedAt: FieldRef<"PartsExchange", 'DateTime'>
    readonly driverId: FieldRef<"PartsExchange", 'String'>
    readonly vehicleId: FieldRef<"PartsExchange", 'String'>
  }
    

  // Custom InputTypes
  /**
   * PartsExchange findUnique
   */
  export type PartsExchangeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter, which PartsExchange to fetch.
     */
    where: PartsExchangeWhereUniqueInput
  }

  /**
   * PartsExchange findUniqueOrThrow
   */
  export type PartsExchangeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter, which PartsExchange to fetch.
     */
    where: PartsExchangeWhereUniqueInput
  }

  /**
   * PartsExchange findFirst
   */
  export type PartsExchangeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter, which PartsExchange to fetch.
     */
    where?: PartsExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartsExchanges to fetch.
     */
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PartsExchanges.
     */
    cursor?: PartsExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartsExchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartsExchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PartsExchanges.
     */
    distinct?: PartsExchangeScalarFieldEnum | PartsExchangeScalarFieldEnum[]
  }

  /**
   * PartsExchange findFirstOrThrow
   */
  export type PartsExchangeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter, which PartsExchange to fetch.
     */
    where?: PartsExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartsExchanges to fetch.
     */
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PartsExchanges.
     */
    cursor?: PartsExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartsExchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartsExchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PartsExchanges.
     */
    distinct?: PartsExchangeScalarFieldEnum | PartsExchangeScalarFieldEnum[]
  }

  /**
   * PartsExchange findMany
   */
  export type PartsExchangeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter, which PartsExchanges to fetch.
     */
    where?: PartsExchangeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PartsExchanges to fetch.
     */
    orderBy?: PartsExchangeOrderByWithRelationInput | PartsExchangeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PartsExchanges.
     */
    cursor?: PartsExchangeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PartsExchanges from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PartsExchanges.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PartsExchanges.
     */
    distinct?: PartsExchangeScalarFieldEnum | PartsExchangeScalarFieldEnum[]
  }

  /**
   * PartsExchange create
   */
  export type PartsExchangeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * The data needed to create a PartsExchange.
     */
    data: XOR<PartsExchangeCreateInput, PartsExchangeUncheckedCreateInput>
  }

  /**
   * PartsExchange createMany
   */
  export type PartsExchangeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PartsExchanges.
     */
    data: PartsExchangeCreateManyInput | PartsExchangeCreateManyInput[]
  }

  /**
   * PartsExchange createManyAndReturn
   */
  export type PartsExchangeCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * The data used to create many PartsExchanges.
     */
    data: PartsExchangeCreateManyInput | PartsExchangeCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PartsExchange update
   */
  export type PartsExchangeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * The data needed to update a PartsExchange.
     */
    data: XOR<PartsExchangeUpdateInput, PartsExchangeUncheckedUpdateInput>
    /**
     * Choose, which PartsExchange to update.
     */
    where: PartsExchangeWhereUniqueInput
  }

  /**
   * PartsExchange updateMany
   */
  export type PartsExchangeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PartsExchanges.
     */
    data: XOR<PartsExchangeUpdateManyMutationInput, PartsExchangeUncheckedUpdateManyInput>
    /**
     * Filter which PartsExchanges to update
     */
    where?: PartsExchangeWhereInput
    /**
     * Limit how many PartsExchanges to update.
     */
    limit?: number
  }

  /**
   * PartsExchange updateManyAndReturn
   */
  export type PartsExchangeUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * The data used to update PartsExchanges.
     */
    data: XOR<PartsExchangeUpdateManyMutationInput, PartsExchangeUncheckedUpdateManyInput>
    /**
     * Filter which PartsExchanges to update
     */
    where?: PartsExchangeWhereInput
    /**
     * Limit how many PartsExchanges to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PartsExchange upsert
   */
  export type PartsExchangeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * The filter to search for the PartsExchange to update in case it exists.
     */
    where: PartsExchangeWhereUniqueInput
    /**
     * In case the PartsExchange found by the `where` argument doesn't exist, create a new PartsExchange with this data.
     */
    create: XOR<PartsExchangeCreateInput, PartsExchangeUncheckedCreateInput>
    /**
     * In case the PartsExchange was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PartsExchangeUpdateInput, PartsExchangeUncheckedUpdateInput>
  }

  /**
   * PartsExchange delete
   */
  export type PartsExchangeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
    /**
     * Filter which PartsExchange to delete.
     */
    where: PartsExchangeWhereUniqueInput
  }

  /**
   * PartsExchange deleteMany
   */
  export type PartsExchangeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PartsExchanges to delete
     */
    where?: PartsExchangeWhereInput
    /**
     * Limit how many PartsExchanges to delete.
     */
    limit?: number
  }

  /**
   * PartsExchange without action
   */
  export type PartsExchangeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PartsExchange
     */
    select?: PartsExchangeSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PartsExchange
     */
    omit?: PartsExchangeOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PartsExchangeInclude<ExtArgs> | null
  }


  /**
   * Model SalesRecord
   */

  export type AggregateSalesRecord = {
    _count: SalesRecordCountAggregateOutputType | null
    _avg: SalesRecordAvgAggregateOutputType | null
    _sum: SalesRecordSumAggregateOutputType | null
    _min: SalesRecordMinAggregateOutputType | null
    _max: SalesRecordMaxAggregateOutputType | null
  }

  export type SalesRecordAvgAggregateOutputType = {
    amount: number | null
  }

  export type SalesRecordSumAggregateOutputType = {
    amount: number | null
  }

  export type SalesRecordMinAggregateOutputType = {
    id: string | null
    weekLabel: string | null
    amount: number | null
    paymentMethod: string | null
    momoReference: string | null
    confirmationStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
  }

  export type SalesRecordMaxAggregateOutputType = {
    id: string | null
    weekLabel: string | null
    amount: number | null
    paymentMethod: string | null
    momoReference: string | null
    confirmationStatus: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driverId: string | null
  }

  export type SalesRecordCountAggregateOutputType = {
    id: number
    weekLabel: number
    amount: number
    paymentMethod: number
    momoReference: number
    confirmationStatus: number
    createdAt: number
    updatedAt: number
    driverId: number
    _all: number
  }


  export type SalesRecordAvgAggregateInputType = {
    amount?: true
  }

  export type SalesRecordSumAggregateInputType = {
    amount?: true
  }

  export type SalesRecordMinAggregateInputType = {
    id?: true
    weekLabel?: true
    amount?: true
    paymentMethod?: true
    momoReference?: true
    confirmationStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
  }

  export type SalesRecordMaxAggregateInputType = {
    id?: true
    weekLabel?: true
    amount?: true
    paymentMethod?: true
    momoReference?: true
    confirmationStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
  }

  export type SalesRecordCountAggregateInputType = {
    id?: true
    weekLabel?: true
    amount?: true
    paymentMethod?: true
    momoReference?: true
    confirmationStatus?: true
    createdAt?: true
    updatedAt?: true
    driverId?: true
    _all?: true
  }

  export type SalesRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesRecord to aggregate.
     */
    where?: SalesRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesRecords to fetch.
     */
    orderBy?: SalesRecordOrderByWithRelationInput | SalesRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SalesRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SalesRecords
    **/
    _count?: true | SalesRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SalesRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SalesRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SalesRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SalesRecordMaxAggregateInputType
  }

  export type GetSalesRecordAggregateType<T extends SalesRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateSalesRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSalesRecord[P]>
      : GetScalarType<T[P], AggregateSalesRecord[P]>
  }




  export type SalesRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SalesRecordWhereInput
    orderBy?: SalesRecordOrderByWithAggregationInput | SalesRecordOrderByWithAggregationInput[]
    by: SalesRecordScalarFieldEnum[] | SalesRecordScalarFieldEnum
    having?: SalesRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SalesRecordCountAggregateInputType | true
    _avg?: SalesRecordAvgAggregateInputType
    _sum?: SalesRecordSumAggregateInputType
    _min?: SalesRecordMinAggregateInputType
    _max?: SalesRecordMaxAggregateInputType
  }

  export type SalesRecordGroupByOutputType = {
    id: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference: string | null
    confirmationStatus: string
    createdAt: Date
    updatedAt: Date
    driverId: string
    _count: SalesRecordCountAggregateOutputType | null
    _avg: SalesRecordAvgAggregateOutputType | null
    _sum: SalesRecordSumAggregateOutputType | null
    _min: SalesRecordMinAggregateOutputType | null
    _max: SalesRecordMaxAggregateOutputType | null
  }

  type GetSalesRecordGroupByPayload<T extends SalesRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SalesRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SalesRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SalesRecordGroupByOutputType[P]>
            : GetScalarType<T[P], SalesRecordGroupByOutputType[P]>
        }
      >
    >


  export type SalesRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weekLabel?: boolean
    amount?: boolean
    paymentMethod?: boolean
    momoReference?: boolean
    confirmationStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesRecord"]>

  export type SalesRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weekLabel?: boolean
    amount?: boolean
    paymentMethod?: boolean
    momoReference?: boolean
    confirmationStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesRecord"]>

  export type SalesRecordSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    weekLabel?: boolean
    amount?: boolean
    paymentMethod?: boolean
    momoReference?: boolean
    confirmationStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["salesRecord"]>

  export type SalesRecordSelectScalar = {
    id?: boolean
    weekLabel?: boolean
    amount?: boolean
    paymentMethod?: boolean
    momoReference?: boolean
    confirmationStatus?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driverId?: boolean
  }

  export type SalesRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "weekLabel" | "amount" | "paymentMethod" | "momoReference" | "confirmationStatus" | "createdAt" | "updatedAt" | "driverId", ExtArgs["result"]["salesRecord"]>
  export type SalesRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type SalesRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type SalesRecordIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }

  export type $SalesRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SalesRecord"
    objects: {
      driver: Prisma.$DriverPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      weekLabel: string
      amount: number
      paymentMethod: string
      momoReference: string | null
      confirmationStatus: string
      createdAt: Date
      updatedAt: Date
      driverId: string
    }, ExtArgs["result"]["salesRecord"]>
    composites: {}
  }

  type SalesRecordGetPayload<S extends boolean | null | undefined | SalesRecordDefaultArgs> = $Result.GetResult<Prisma.$SalesRecordPayload, S>

  type SalesRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SalesRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SalesRecordCountAggregateInputType | true
    }

  export interface SalesRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SalesRecord'], meta: { name: 'SalesRecord' } }
    /**
     * Find zero or one SalesRecord that matches the filter.
     * @param {SalesRecordFindUniqueArgs} args - Arguments to find a SalesRecord
     * @example
     * // Get one SalesRecord
     * const salesRecord = await prisma.salesRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SalesRecordFindUniqueArgs>(args: SelectSubset<T, SalesRecordFindUniqueArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SalesRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SalesRecordFindUniqueOrThrowArgs} args - Arguments to find a SalesRecord
     * @example
     * // Get one SalesRecord
     * const salesRecord = await prisma.salesRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SalesRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, SalesRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordFindFirstArgs} args - Arguments to find a SalesRecord
     * @example
     * // Get one SalesRecord
     * const salesRecord = await prisma.salesRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SalesRecordFindFirstArgs>(args?: SelectSubset<T, SalesRecordFindFirstArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SalesRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordFindFirstOrThrowArgs} args - Arguments to find a SalesRecord
     * @example
     * // Get one SalesRecord
     * const salesRecord = await prisma.salesRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SalesRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, SalesRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SalesRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SalesRecords
     * const salesRecords = await prisma.salesRecord.findMany()
     * 
     * // Get first 10 SalesRecords
     * const salesRecords = await prisma.salesRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const salesRecordWithIdOnly = await prisma.salesRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SalesRecordFindManyArgs>(args?: SelectSubset<T, SalesRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SalesRecord.
     * @param {SalesRecordCreateArgs} args - Arguments to create a SalesRecord.
     * @example
     * // Create one SalesRecord
     * const SalesRecord = await prisma.salesRecord.create({
     *   data: {
     *     // ... data to create a SalesRecord
     *   }
     * })
     * 
     */
    create<T extends SalesRecordCreateArgs>(args: SelectSubset<T, SalesRecordCreateArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SalesRecords.
     * @param {SalesRecordCreateManyArgs} args - Arguments to create many SalesRecords.
     * @example
     * // Create many SalesRecords
     * const salesRecord = await prisma.salesRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SalesRecordCreateManyArgs>(args?: SelectSubset<T, SalesRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SalesRecords and returns the data saved in the database.
     * @param {SalesRecordCreateManyAndReturnArgs} args - Arguments to create many SalesRecords.
     * @example
     * // Create many SalesRecords
     * const salesRecord = await prisma.salesRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SalesRecords and only return the `id`
     * const salesRecordWithIdOnly = await prisma.salesRecord.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SalesRecordCreateManyAndReturnArgs>(args?: SelectSubset<T, SalesRecordCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SalesRecord.
     * @param {SalesRecordDeleteArgs} args - Arguments to delete one SalesRecord.
     * @example
     * // Delete one SalesRecord
     * const SalesRecord = await prisma.salesRecord.delete({
     *   where: {
     *     // ... filter to delete one SalesRecord
     *   }
     * })
     * 
     */
    delete<T extends SalesRecordDeleteArgs>(args: SelectSubset<T, SalesRecordDeleteArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SalesRecord.
     * @param {SalesRecordUpdateArgs} args - Arguments to update one SalesRecord.
     * @example
     * // Update one SalesRecord
     * const salesRecord = await prisma.salesRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SalesRecordUpdateArgs>(args: SelectSubset<T, SalesRecordUpdateArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SalesRecords.
     * @param {SalesRecordDeleteManyArgs} args - Arguments to filter SalesRecords to delete.
     * @example
     * // Delete a few SalesRecords
     * const { count } = await prisma.salesRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SalesRecordDeleteManyArgs>(args?: SelectSubset<T, SalesRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SalesRecords
     * const salesRecord = await prisma.salesRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SalesRecordUpdateManyArgs>(args: SelectSubset<T, SalesRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SalesRecords and returns the data updated in the database.
     * @param {SalesRecordUpdateManyAndReturnArgs} args - Arguments to update many SalesRecords.
     * @example
     * // Update many SalesRecords
     * const salesRecord = await prisma.salesRecord.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SalesRecords and only return the `id`
     * const salesRecordWithIdOnly = await prisma.salesRecord.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SalesRecordUpdateManyAndReturnArgs>(args: SelectSubset<T, SalesRecordUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SalesRecord.
     * @param {SalesRecordUpsertArgs} args - Arguments to update or create a SalesRecord.
     * @example
     * // Update or create a SalesRecord
     * const salesRecord = await prisma.salesRecord.upsert({
     *   create: {
     *     // ... data to create a SalesRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SalesRecord we want to update
     *   }
     * })
     */
    upsert<T extends SalesRecordUpsertArgs>(args: SelectSubset<T, SalesRecordUpsertArgs<ExtArgs>>): Prisma__SalesRecordClient<$Result.GetResult<Prisma.$SalesRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SalesRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordCountArgs} args - Arguments to filter SalesRecords to count.
     * @example
     * // Count the number of SalesRecords
     * const count = await prisma.salesRecord.count({
     *   where: {
     *     // ... the filter for the SalesRecords we want to count
     *   }
     * })
    **/
    count<T extends SalesRecordCountArgs>(
      args?: Subset<T, SalesRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SalesRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SalesRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SalesRecordAggregateArgs>(args: Subset<T, SalesRecordAggregateArgs>): Prisma.PrismaPromise<GetSalesRecordAggregateType<T>>

    /**
     * Group by SalesRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SalesRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SalesRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SalesRecordGroupByArgs['orderBy'] }
        : { orderBy?: SalesRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SalesRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SalesRecord model
   */
  readonly fields: SalesRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SalesRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SalesRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SalesRecord model
   */
  interface SalesRecordFieldRefs {
    readonly id: FieldRef<"SalesRecord", 'String'>
    readonly weekLabel: FieldRef<"SalesRecord", 'String'>
    readonly amount: FieldRef<"SalesRecord", 'Float'>
    readonly paymentMethod: FieldRef<"SalesRecord", 'String'>
    readonly momoReference: FieldRef<"SalesRecord", 'String'>
    readonly confirmationStatus: FieldRef<"SalesRecord", 'String'>
    readonly createdAt: FieldRef<"SalesRecord", 'DateTime'>
    readonly updatedAt: FieldRef<"SalesRecord", 'DateTime'>
    readonly driverId: FieldRef<"SalesRecord", 'String'>
  }
    

  // Custom InputTypes
  /**
   * SalesRecord findUnique
   */
  export type SalesRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter, which SalesRecord to fetch.
     */
    where: SalesRecordWhereUniqueInput
  }

  /**
   * SalesRecord findUniqueOrThrow
   */
  export type SalesRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter, which SalesRecord to fetch.
     */
    where: SalesRecordWhereUniqueInput
  }

  /**
   * SalesRecord findFirst
   */
  export type SalesRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter, which SalesRecord to fetch.
     */
    where?: SalesRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesRecords to fetch.
     */
    orderBy?: SalesRecordOrderByWithRelationInput | SalesRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesRecords.
     */
    cursor?: SalesRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesRecords.
     */
    distinct?: SalesRecordScalarFieldEnum | SalesRecordScalarFieldEnum[]
  }

  /**
   * SalesRecord findFirstOrThrow
   */
  export type SalesRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter, which SalesRecord to fetch.
     */
    where?: SalesRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesRecords to fetch.
     */
    orderBy?: SalesRecordOrderByWithRelationInput | SalesRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SalesRecords.
     */
    cursor?: SalesRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesRecords.
     */
    distinct?: SalesRecordScalarFieldEnum | SalesRecordScalarFieldEnum[]
  }

  /**
   * SalesRecord findMany
   */
  export type SalesRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter, which SalesRecords to fetch.
     */
    where?: SalesRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SalesRecords to fetch.
     */
    orderBy?: SalesRecordOrderByWithRelationInput | SalesRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SalesRecords.
     */
    cursor?: SalesRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SalesRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SalesRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SalesRecords.
     */
    distinct?: SalesRecordScalarFieldEnum | SalesRecordScalarFieldEnum[]
  }

  /**
   * SalesRecord create
   */
  export type SalesRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a SalesRecord.
     */
    data: XOR<SalesRecordCreateInput, SalesRecordUncheckedCreateInput>
  }

  /**
   * SalesRecord createMany
   */
  export type SalesRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SalesRecords.
     */
    data: SalesRecordCreateManyInput | SalesRecordCreateManyInput[]
  }

  /**
   * SalesRecord createManyAndReturn
   */
  export type SalesRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * The data used to create many SalesRecords.
     */
    data: SalesRecordCreateManyInput | SalesRecordCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesRecord update
   */
  export type SalesRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a SalesRecord.
     */
    data: XOR<SalesRecordUpdateInput, SalesRecordUncheckedUpdateInput>
    /**
     * Choose, which SalesRecord to update.
     */
    where: SalesRecordWhereUniqueInput
  }

  /**
   * SalesRecord updateMany
   */
  export type SalesRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SalesRecords.
     */
    data: XOR<SalesRecordUpdateManyMutationInput, SalesRecordUncheckedUpdateManyInput>
    /**
     * Filter which SalesRecords to update
     */
    where?: SalesRecordWhereInput
    /**
     * Limit how many SalesRecords to update.
     */
    limit?: number
  }

  /**
   * SalesRecord updateManyAndReturn
   */
  export type SalesRecordUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * The data used to update SalesRecords.
     */
    data: XOR<SalesRecordUpdateManyMutationInput, SalesRecordUncheckedUpdateManyInput>
    /**
     * Filter which SalesRecords to update
     */
    where?: SalesRecordWhereInput
    /**
     * Limit how many SalesRecords to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SalesRecord upsert
   */
  export type SalesRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the SalesRecord to update in case it exists.
     */
    where: SalesRecordWhereUniqueInput
    /**
     * In case the SalesRecord found by the `where` argument doesn't exist, create a new SalesRecord with this data.
     */
    create: XOR<SalesRecordCreateInput, SalesRecordUncheckedCreateInput>
    /**
     * In case the SalesRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SalesRecordUpdateInput, SalesRecordUncheckedUpdateInput>
  }

  /**
   * SalesRecord delete
   */
  export type SalesRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
    /**
     * Filter which SalesRecord to delete.
     */
    where: SalesRecordWhereUniqueInput
  }

  /**
   * SalesRecord deleteMany
   */
  export type SalesRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SalesRecords to delete
     */
    where?: SalesRecordWhereInput
    /**
     * Limit how many SalesRecords to delete.
     */
    limit?: number
  }

  /**
   * SalesRecord without action
   */
  export type SalesRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SalesRecord
     */
    select?: SalesRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SalesRecord
     */
    omit?: SalesRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SalesRecordInclude<ExtArgs> | null
  }


  /**
   * Model LedgerEntry
   */

  export type AggregateLedgerEntry = {
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  export type LedgerEntryAvgAggregateOutputType = {
    amount: number | null
  }

  export type LedgerEntrySumAggregateOutputType = {
    amount: number | null
  }

  export type LedgerEntryMinAggregateOutputType = {
    id: string | null
    amount: number | null
    direction: string | null
    description: string | null
    createdAt: Date | null
    driverId: string | null
  }

  export type LedgerEntryMaxAggregateOutputType = {
    id: string | null
    amount: number | null
    direction: string | null
    description: string | null
    createdAt: Date | null
    driverId: string | null
  }

  export type LedgerEntryCountAggregateOutputType = {
    id: number
    amount: number
    direction: number
    description: number
    createdAt: number
    driverId: number
    _all: number
  }


  export type LedgerEntryAvgAggregateInputType = {
    amount?: true
  }

  export type LedgerEntrySumAggregateInputType = {
    amount?: true
  }

  export type LedgerEntryMinAggregateInputType = {
    id?: true
    amount?: true
    direction?: true
    description?: true
    createdAt?: true
    driverId?: true
  }

  export type LedgerEntryMaxAggregateInputType = {
    id?: true
    amount?: true
    direction?: true
    description?: true
    createdAt?: true
    driverId?: true
  }

  export type LedgerEntryCountAggregateInputType = {
    id?: true
    amount?: true
    direction?: true
    description?: true
    createdAt?: true
    driverId?: true
    _all?: true
  }

  export type LedgerEntryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntry to aggregate.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LedgerEntries
    **/
    _count?: true | LedgerEntryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LedgerEntryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LedgerEntrySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LedgerEntryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type GetLedgerEntryAggregateType<T extends LedgerEntryAggregateArgs> = {
        [P in keyof T & keyof AggregateLedgerEntry]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLedgerEntry[P]>
      : GetScalarType<T[P], AggregateLedgerEntry[P]>
  }




  export type LedgerEntryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LedgerEntryWhereInput
    orderBy?: LedgerEntryOrderByWithAggregationInput | LedgerEntryOrderByWithAggregationInput[]
    by: LedgerEntryScalarFieldEnum[] | LedgerEntryScalarFieldEnum
    having?: LedgerEntryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LedgerEntryCountAggregateInputType | true
    _avg?: LedgerEntryAvgAggregateInputType
    _sum?: LedgerEntrySumAggregateInputType
    _min?: LedgerEntryMinAggregateInputType
    _max?: LedgerEntryMaxAggregateInputType
  }

  export type LedgerEntryGroupByOutputType = {
    id: string
    amount: number
    direction: string
    description: string
    createdAt: Date
    driverId: string
    _count: LedgerEntryCountAggregateOutputType | null
    _avg: LedgerEntryAvgAggregateOutputType | null
    _sum: LedgerEntrySumAggregateOutputType | null
    _min: LedgerEntryMinAggregateOutputType | null
    _max: LedgerEntryMaxAggregateOutputType | null
  }

  type GetLedgerEntryGroupByPayload<T extends LedgerEntryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LedgerEntryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LedgerEntryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
            : GetScalarType<T[P], LedgerEntryGroupByOutputType[P]>
        }
      >
    >


  export type LedgerEntrySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    direction?: boolean
    description?: boolean
    createdAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    direction?: boolean
    description?: boolean
    createdAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    amount?: boolean
    direction?: boolean
    description?: boolean
    createdAt?: boolean
    driverId?: boolean
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["ledgerEntry"]>

  export type LedgerEntrySelectScalar = {
    id?: boolean
    amount?: boolean
    direction?: boolean
    description?: boolean
    createdAt?: boolean
    driverId?: boolean
  }

  export type LedgerEntryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "amount" | "direction" | "description" | "createdAt" | "driverId", ExtArgs["result"]["ledgerEntry"]>
  export type LedgerEntryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type LedgerEntryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type LedgerEntryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver?: boolean | DriverDefaultArgs<ExtArgs>
  }

  export type $LedgerEntryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LedgerEntry"
    objects: {
      driver: Prisma.$DriverPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      amount: number
      direction: string
      description: string
      createdAt: Date
      driverId: string
    }, ExtArgs["result"]["ledgerEntry"]>
    composites: {}
  }

  type LedgerEntryGetPayload<S extends boolean | null | undefined | LedgerEntryDefaultArgs> = $Result.GetResult<Prisma.$LedgerEntryPayload, S>

  type LedgerEntryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LedgerEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LedgerEntryCountAggregateInputType | true
    }

  export interface LedgerEntryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LedgerEntry'], meta: { name: 'LedgerEntry' } }
    /**
     * Find zero or one LedgerEntry that matches the filter.
     * @param {LedgerEntryFindUniqueArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LedgerEntryFindUniqueArgs>(args: SelectSubset<T, LedgerEntryFindUniqueArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LedgerEntry that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LedgerEntryFindUniqueOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LedgerEntryFindUniqueOrThrowArgs>(args: SelectSubset<T, LedgerEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LedgerEntryFindFirstArgs>(args?: SelectSubset<T, LedgerEntryFindFirstArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LedgerEntry that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindFirstOrThrowArgs} args - Arguments to find a LedgerEntry
     * @example
     * // Get one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LedgerEntryFindFirstOrThrowArgs>(args?: SelectSubset<T, LedgerEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LedgerEntries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany()
     * 
     * // Get first 10 LedgerEntries
     * const ledgerEntries = await prisma.ledgerEntry.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LedgerEntryFindManyArgs>(args?: SelectSubset<T, LedgerEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LedgerEntry.
     * @param {LedgerEntryCreateArgs} args - Arguments to create a LedgerEntry.
     * @example
     * // Create one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.create({
     *   data: {
     *     // ... data to create a LedgerEntry
     *   }
     * })
     * 
     */
    create<T extends LedgerEntryCreateArgs>(args: SelectSubset<T, LedgerEntryCreateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LedgerEntries.
     * @param {LedgerEntryCreateManyArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LedgerEntryCreateManyArgs>(args?: SelectSubset<T, LedgerEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LedgerEntries and returns the data saved in the database.
     * @param {LedgerEntryCreateManyAndReturnArgs} args - Arguments to create many LedgerEntries.
     * @example
     * // Create many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LedgerEntryCreateManyAndReturnArgs>(args?: SelectSubset<T, LedgerEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LedgerEntry.
     * @param {LedgerEntryDeleteArgs} args - Arguments to delete one LedgerEntry.
     * @example
     * // Delete one LedgerEntry
     * const LedgerEntry = await prisma.ledgerEntry.delete({
     *   where: {
     *     // ... filter to delete one LedgerEntry
     *   }
     * })
     * 
     */
    delete<T extends LedgerEntryDeleteArgs>(args: SelectSubset<T, LedgerEntryDeleteArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LedgerEntry.
     * @param {LedgerEntryUpdateArgs} args - Arguments to update one LedgerEntry.
     * @example
     * // Update one LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LedgerEntryUpdateArgs>(args: SelectSubset<T, LedgerEntryUpdateArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LedgerEntries.
     * @param {LedgerEntryDeleteManyArgs} args - Arguments to filter LedgerEntries to delete.
     * @example
     * // Delete a few LedgerEntries
     * const { count } = await prisma.ledgerEntry.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LedgerEntryDeleteManyArgs>(args?: SelectSubset<T, LedgerEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LedgerEntryUpdateManyArgs>(args: SelectSubset<T, LedgerEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LedgerEntries and returns the data updated in the database.
     * @param {LedgerEntryUpdateManyAndReturnArgs} args - Arguments to update many LedgerEntries.
     * @example
     * // Update many LedgerEntries
     * const ledgerEntry = await prisma.ledgerEntry.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LedgerEntries and only return the `id`
     * const ledgerEntryWithIdOnly = await prisma.ledgerEntry.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LedgerEntryUpdateManyAndReturnArgs>(args: SelectSubset<T, LedgerEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LedgerEntry.
     * @param {LedgerEntryUpsertArgs} args - Arguments to update or create a LedgerEntry.
     * @example
     * // Update or create a LedgerEntry
     * const ledgerEntry = await prisma.ledgerEntry.upsert({
     *   create: {
     *     // ... data to create a LedgerEntry
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LedgerEntry we want to update
     *   }
     * })
     */
    upsert<T extends LedgerEntryUpsertArgs>(args: SelectSubset<T, LedgerEntryUpsertArgs<ExtArgs>>): Prisma__LedgerEntryClient<$Result.GetResult<Prisma.$LedgerEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LedgerEntries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryCountArgs} args - Arguments to filter LedgerEntries to count.
     * @example
     * // Count the number of LedgerEntries
     * const count = await prisma.ledgerEntry.count({
     *   where: {
     *     // ... the filter for the LedgerEntries we want to count
     *   }
     * })
    **/
    count<T extends LedgerEntryCountArgs>(
      args?: Subset<T, LedgerEntryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LedgerEntryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LedgerEntryAggregateArgs>(args: Subset<T, LedgerEntryAggregateArgs>): Prisma.PrismaPromise<GetLedgerEntryAggregateType<T>>

    /**
     * Group by LedgerEntry.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LedgerEntryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LedgerEntryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LedgerEntryGroupByArgs['orderBy'] }
        : { orderBy?: LedgerEntryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LedgerEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLedgerEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LedgerEntry model
   */
  readonly fields: LedgerEntryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LedgerEntry.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LedgerEntryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    driver<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LedgerEntry model
   */
  interface LedgerEntryFieldRefs {
    readonly id: FieldRef<"LedgerEntry", 'String'>
    readonly amount: FieldRef<"LedgerEntry", 'Float'>
    readonly direction: FieldRef<"LedgerEntry", 'String'>
    readonly description: FieldRef<"LedgerEntry", 'String'>
    readonly createdAt: FieldRef<"LedgerEntry", 'DateTime'>
    readonly driverId: FieldRef<"LedgerEntry", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LedgerEntry findUnique
   */
  export type LedgerEntryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findUniqueOrThrow
   */
  export type LedgerEntryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry findFirst
   */
  export type LedgerEntryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findFirstOrThrow
   */
  export type LedgerEntryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntry to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry findMany
   */
  export type LedgerEntryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter, which LedgerEntries to fetch.
     */
    where?: LedgerEntryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LedgerEntries to fetch.
     */
    orderBy?: LedgerEntryOrderByWithRelationInput | LedgerEntryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LedgerEntries.
     */
    cursor?: LedgerEntryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LedgerEntries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LedgerEntries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LedgerEntries.
     */
    distinct?: LedgerEntryScalarFieldEnum | LedgerEntryScalarFieldEnum[]
  }

  /**
   * LedgerEntry create
   */
  export type LedgerEntryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The data needed to create a LedgerEntry.
     */
    data: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
  }

  /**
   * LedgerEntry createMany
   */
  export type LedgerEntryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
  }

  /**
   * LedgerEntry createManyAndReturn
   */
  export type LedgerEntryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to create many LedgerEntries.
     */
    data: LedgerEntryCreateManyInput | LedgerEntryCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LedgerEntry update
   */
  export type LedgerEntryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The data needed to update a LedgerEntry.
     */
    data: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
    /**
     * Choose, which LedgerEntry to update.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry updateMany
   */
  export type LedgerEntryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
  }

  /**
   * LedgerEntry updateManyAndReturn
   */
  export type LedgerEntryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * The data used to update LedgerEntries.
     */
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyInput>
    /**
     * Filter which LedgerEntries to update
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LedgerEntry upsert
   */
  export type LedgerEntryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * The filter to search for the LedgerEntry to update in case it exists.
     */
    where: LedgerEntryWhereUniqueInput
    /**
     * In case the LedgerEntry found by the `where` argument doesn't exist, create a new LedgerEntry with this data.
     */
    create: XOR<LedgerEntryCreateInput, LedgerEntryUncheckedCreateInput>
    /**
     * In case the LedgerEntry was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LedgerEntryUpdateInput, LedgerEntryUncheckedUpdateInput>
  }

  /**
   * LedgerEntry delete
   */
  export type LedgerEntryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
    /**
     * Filter which LedgerEntry to delete.
     */
    where: LedgerEntryWhereUniqueInput
  }

  /**
   * LedgerEntry deleteMany
   */
  export type LedgerEntryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LedgerEntries to delete
     */
    where?: LedgerEntryWhereInput
    /**
     * Limit how many LedgerEntries to delete.
     */
    limit?: number
  }

  /**
   * LedgerEntry without action
   */
  export type LedgerEntryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LedgerEntry
     */
    select?: LedgerEntrySelect<ExtArgs> | null
    /**
     * Omit specific fields from the LedgerEntry
     */
    omit?: LedgerEntryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LedgerEntryInclude<ExtArgs> | null
  }


  /**
   * Model LocationPing
   */

  export type AggregateLocationPing = {
    _count: LocationPingCountAggregateOutputType | null
    _avg: LocationPingAvgAggregateOutputType | null
    _sum: LocationPingSumAggregateOutputType | null
    _min: LocationPingMinAggregateOutputType | null
    _max: LocationPingMaxAggregateOutputType | null
  }

  export type LocationPingAvgAggregateOutputType = {
    lat: number | null
    lng: number | null
  }

  export type LocationPingSumAggregateOutputType = {
    lat: number | null
    lng: number | null
  }

  export type LocationPingMinAggregateOutputType = {
    id: string | null
    lat: number | null
    lng: number | null
    timestamp: Date | null
    vehicleId: string | null
    gpsDeviceId: string | null
  }

  export type LocationPingMaxAggregateOutputType = {
    id: string | null
    lat: number | null
    lng: number | null
    timestamp: Date | null
    vehicleId: string | null
    gpsDeviceId: string | null
  }

  export type LocationPingCountAggregateOutputType = {
    id: number
    lat: number
    lng: number
    timestamp: number
    vehicleId: number
    gpsDeviceId: number
    _all: number
  }


  export type LocationPingAvgAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type LocationPingSumAggregateInputType = {
    lat?: true
    lng?: true
  }

  export type LocationPingMinAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
    timestamp?: true
    vehicleId?: true
    gpsDeviceId?: true
  }

  export type LocationPingMaxAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
    timestamp?: true
    vehicleId?: true
    gpsDeviceId?: true
  }

  export type LocationPingCountAggregateInputType = {
    id?: true
    lat?: true
    lng?: true
    timestamp?: true
    vehicleId?: true
    gpsDeviceId?: true
    _all?: true
  }

  export type LocationPingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationPing to aggregate.
     */
    where?: LocationPingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationPings to fetch.
     */
    orderBy?: LocationPingOrderByWithRelationInput | LocationPingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LocationPingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationPings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationPings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LocationPings
    **/
    _count?: true | LocationPingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LocationPingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LocationPingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LocationPingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LocationPingMaxAggregateInputType
  }

  export type GetLocationPingAggregateType<T extends LocationPingAggregateArgs> = {
        [P in keyof T & keyof AggregateLocationPing]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLocationPing[P]>
      : GetScalarType<T[P], AggregateLocationPing[P]>
  }




  export type LocationPingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LocationPingWhereInput
    orderBy?: LocationPingOrderByWithAggregationInput | LocationPingOrderByWithAggregationInput[]
    by: LocationPingScalarFieldEnum[] | LocationPingScalarFieldEnum
    having?: LocationPingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LocationPingCountAggregateInputType | true
    _avg?: LocationPingAvgAggregateInputType
    _sum?: LocationPingSumAggregateInputType
    _min?: LocationPingMinAggregateInputType
    _max?: LocationPingMaxAggregateInputType
  }

  export type LocationPingGroupByOutputType = {
    id: string
    lat: number
    lng: number
    timestamp: Date
    vehicleId: string
    gpsDeviceId: string | null
    _count: LocationPingCountAggregateOutputType | null
    _avg: LocationPingAvgAggregateOutputType | null
    _sum: LocationPingSumAggregateOutputType | null
    _min: LocationPingMinAggregateOutputType | null
    _max: LocationPingMaxAggregateOutputType | null
  }

  type GetLocationPingGroupByPayload<T extends LocationPingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LocationPingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LocationPingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LocationPingGroupByOutputType[P]>
            : GetScalarType<T[P], LocationPingGroupByOutputType[P]>
        }
      >
    >


  export type LocationPingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lat?: boolean
    lng?: boolean
    timestamp?: boolean
    vehicleId?: boolean
    gpsDeviceId?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationPing"]>

  export type LocationPingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lat?: boolean
    lng?: boolean
    timestamp?: boolean
    vehicleId?: boolean
    gpsDeviceId?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationPing"]>

  export type LocationPingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lat?: boolean
    lng?: boolean
    timestamp?: boolean
    vehicleId?: boolean
    gpsDeviceId?: boolean
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["locationPing"]>

  export type LocationPingSelectScalar = {
    id?: boolean
    lat?: boolean
    lng?: boolean
    timestamp?: boolean
    vehicleId?: boolean
    gpsDeviceId?: boolean
  }

  export type LocationPingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lat" | "lng" | "timestamp" | "vehicleId" | "gpsDeviceId", ExtArgs["result"]["locationPing"]>
  export type LocationPingInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type LocationPingIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }
  export type LocationPingIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    vehicle?: boolean | VehicleDefaultArgs<ExtArgs>
  }

  export type $LocationPingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LocationPing"
    objects: {
      vehicle: Prisma.$VehiclePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lat: number
      lng: number
      timestamp: Date
      vehicleId: string
      gpsDeviceId: string | null
    }, ExtArgs["result"]["locationPing"]>
    composites: {}
  }

  type LocationPingGetPayload<S extends boolean | null | undefined | LocationPingDefaultArgs> = $Result.GetResult<Prisma.$LocationPingPayload, S>

  type LocationPingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LocationPingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LocationPingCountAggregateInputType | true
    }

  export interface LocationPingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LocationPing'], meta: { name: 'LocationPing' } }
    /**
     * Find zero or one LocationPing that matches the filter.
     * @param {LocationPingFindUniqueArgs} args - Arguments to find a LocationPing
     * @example
     * // Get one LocationPing
     * const locationPing = await prisma.locationPing.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LocationPingFindUniqueArgs>(args: SelectSubset<T, LocationPingFindUniqueArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LocationPing that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LocationPingFindUniqueOrThrowArgs} args - Arguments to find a LocationPing
     * @example
     * // Get one LocationPing
     * const locationPing = await prisma.locationPing.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LocationPingFindUniqueOrThrowArgs>(args: SelectSubset<T, LocationPingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationPing that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingFindFirstArgs} args - Arguments to find a LocationPing
     * @example
     * // Get one LocationPing
     * const locationPing = await prisma.locationPing.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LocationPingFindFirstArgs>(args?: SelectSubset<T, LocationPingFindFirstArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LocationPing that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingFindFirstOrThrowArgs} args - Arguments to find a LocationPing
     * @example
     * // Get one LocationPing
     * const locationPing = await prisma.locationPing.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LocationPingFindFirstOrThrowArgs>(args?: SelectSubset<T, LocationPingFindFirstOrThrowArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LocationPings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LocationPings
     * const locationPings = await prisma.locationPing.findMany()
     * 
     * // Get first 10 LocationPings
     * const locationPings = await prisma.locationPing.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const locationPingWithIdOnly = await prisma.locationPing.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LocationPingFindManyArgs>(args?: SelectSubset<T, LocationPingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LocationPing.
     * @param {LocationPingCreateArgs} args - Arguments to create a LocationPing.
     * @example
     * // Create one LocationPing
     * const LocationPing = await prisma.locationPing.create({
     *   data: {
     *     // ... data to create a LocationPing
     *   }
     * })
     * 
     */
    create<T extends LocationPingCreateArgs>(args: SelectSubset<T, LocationPingCreateArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LocationPings.
     * @param {LocationPingCreateManyArgs} args - Arguments to create many LocationPings.
     * @example
     * // Create many LocationPings
     * const locationPing = await prisma.locationPing.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LocationPingCreateManyArgs>(args?: SelectSubset<T, LocationPingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LocationPings and returns the data saved in the database.
     * @param {LocationPingCreateManyAndReturnArgs} args - Arguments to create many LocationPings.
     * @example
     * // Create many LocationPings
     * const locationPing = await prisma.locationPing.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LocationPings and only return the `id`
     * const locationPingWithIdOnly = await prisma.locationPing.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LocationPingCreateManyAndReturnArgs>(args?: SelectSubset<T, LocationPingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LocationPing.
     * @param {LocationPingDeleteArgs} args - Arguments to delete one LocationPing.
     * @example
     * // Delete one LocationPing
     * const LocationPing = await prisma.locationPing.delete({
     *   where: {
     *     // ... filter to delete one LocationPing
     *   }
     * })
     * 
     */
    delete<T extends LocationPingDeleteArgs>(args: SelectSubset<T, LocationPingDeleteArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LocationPing.
     * @param {LocationPingUpdateArgs} args - Arguments to update one LocationPing.
     * @example
     * // Update one LocationPing
     * const locationPing = await prisma.locationPing.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LocationPingUpdateArgs>(args: SelectSubset<T, LocationPingUpdateArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LocationPings.
     * @param {LocationPingDeleteManyArgs} args - Arguments to filter LocationPings to delete.
     * @example
     * // Delete a few LocationPings
     * const { count } = await prisma.locationPing.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LocationPingDeleteManyArgs>(args?: SelectSubset<T, LocationPingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationPings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LocationPings
     * const locationPing = await prisma.locationPing.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LocationPingUpdateManyArgs>(args: SelectSubset<T, LocationPingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LocationPings and returns the data updated in the database.
     * @param {LocationPingUpdateManyAndReturnArgs} args - Arguments to update many LocationPings.
     * @example
     * // Update many LocationPings
     * const locationPing = await prisma.locationPing.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LocationPings and only return the `id`
     * const locationPingWithIdOnly = await prisma.locationPing.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LocationPingUpdateManyAndReturnArgs>(args: SelectSubset<T, LocationPingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LocationPing.
     * @param {LocationPingUpsertArgs} args - Arguments to update or create a LocationPing.
     * @example
     * // Update or create a LocationPing
     * const locationPing = await prisma.locationPing.upsert({
     *   create: {
     *     // ... data to create a LocationPing
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LocationPing we want to update
     *   }
     * })
     */
    upsert<T extends LocationPingUpsertArgs>(args: SelectSubset<T, LocationPingUpsertArgs<ExtArgs>>): Prisma__LocationPingClient<$Result.GetResult<Prisma.$LocationPingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LocationPings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingCountArgs} args - Arguments to filter LocationPings to count.
     * @example
     * // Count the number of LocationPings
     * const count = await prisma.locationPing.count({
     *   where: {
     *     // ... the filter for the LocationPings we want to count
     *   }
     * })
    **/
    count<T extends LocationPingCountArgs>(
      args?: Subset<T, LocationPingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LocationPingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LocationPing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LocationPingAggregateArgs>(args: Subset<T, LocationPingAggregateArgs>): Prisma.PrismaPromise<GetLocationPingAggregateType<T>>

    /**
     * Group by LocationPing.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LocationPingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LocationPingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LocationPingGroupByArgs['orderBy'] }
        : { orderBy?: LocationPingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LocationPingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLocationPingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LocationPing model
   */
  readonly fields: LocationPingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LocationPing.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LocationPingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    vehicle<T extends VehicleDefaultArgs<ExtArgs> = {}>(args?: Subset<T, VehicleDefaultArgs<ExtArgs>>): Prisma__VehicleClient<$Result.GetResult<Prisma.$VehiclePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LocationPing model
   */
  interface LocationPingFieldRefs {
    readonly id: FieldRef<"LocationPing", 'String'>
    readonly lat: FieldRef<"LocationPing", 'Float'>
    readonly lng: FieldRef<"LocationPing", 'Float'>
    readonly timestamp: FieldRef<"LocationPing", 'DateTime'>
    readonly vehicleId: FieldRef<"LocationPing", 'String'>
    readonly gpsDeviceId: FieldRef<"LocationPing", 'String'>
  }
    

  // Custom InputTypes
  /**
   * LocationPing findUnique
   */
  export type LocationPingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter, which LocationPing to fetch.
     */
    where: LocationPingWhereUniqueInput
  }

  /**
   * LocationPing findUniqueOrThrow
   */
  export type LocationPingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter, which LocationPing to fetch.
     */
    where: LocationPingWhereUniqueInput
  }

  /**
   * LocationPing findFirst
   */
  export type LocationPingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter, which LocationPing to fetch.
     */
    where?: LocationPingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationPings to fetch.
     */
    orderBy?: LocationPingOrderByWithRelationInput | LocationPingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationPings.
     */
    cursor?: LocationPingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationPings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationPings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationPings.
     */
    distinct?: LocationPingScalarFieldEnum | LocationPingScalarFieldEnum[]
  }

  /**
   * LocationPing findFirstOrThrow
   */
  export type LocationPingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter, which LocationPing to fetch.
     */
    where?: LocationPingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationPings to fetch.
     */
    orderBy?: LocationPingOrderByWithRelationInput | LocationPingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LocationPings.
     */
    cursor?: LocationPingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationPings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationPings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationPings.
     */
    distinct?: LocationPingScalarFieldEnum | LocationPingScalarFieldEnum[]
  }

  /**
   * LocationPing findMany
   */
  export type LocationPingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter, which LocationPings to fetch.
     */
    where?: LocationPingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LocationPings to fetch.
     */
    orderBy?: LocationPingOrderByWithRelationInput | LocationPingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LocationPings.
     */
    cursor?: LocationPingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LocationPings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LocationPings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LocationPings.
     */
    distinct?: LocationPingScalarFieldEnum | LocationPingScalarFieldEnum[]
  }

  /**
   * LocationPing create
   */
  export type LocationPingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * The data needed to create a LocationPing.
     */
    data: XOR<LocationPingCreateInput, LocationPingUncheckedCreateInput>
  }

  /**
   * LocationPing createMany
   */
  export type LocationPingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LocationPings.
     */
    data: LocationPingCreateManyInput | LocationPingCreateManyInput[]
  }

  /**
   * LocationPing createManyAndReturn
   */
  export type LocationPingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * The data used to create many LocationPings.
     */
    data: LocationPingCreateManyInput | LocationPingCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocationPing update
   */
  export type LocationPingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * The data needed to update a LocationPing.
     */
    data: XOR<LocationPingUpdateInput, LocationPingUncheckedUpdateInput>
    /**
     * Choose, which LocationPing to update.
     */
    where: LocationPingWhereUniqueInput
  }

  /**
   * LocationPing updateMany
   */
  export type LocationPingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LocationPings.
     */
    data: XOR<LocationPingUpdateManyMutationInput, LocationPingUncheckedUpdateManyInput>
    /**
     * Filter which LocationPings to update
     */
    where?: LocationPingWhereInput
    /**
     * Limit how many LocationPings to update.
     */
    limit?: number
  }

  /**
   * LocationPing updateManyAndReturn
   */
  export type LocationPingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * The data used to update LocationPings.
     */
    data: XOR<LocationPingUpdateManyMutationInput, LocationPingUncheckedUpdateManyInput>
    /**
     * Filter which LocationPings to update
     */
    where?: LocationPingWhereInput
    /**
     * Limit how many LocationPings to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LocationPing upsert
   */
  export type LocationPingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * The filter to search for the LocationPing to update in case it exists.
     */
    where: LocationPingWhereUniqueInput
    /**
     * In case the LocationPing found by the `where` argument doesn't exist, create a new LocationPing with this data.
     */
    create: XOR<LocationPingCreateInput, LocationPingUncheckedCreateInput>
    /**
     * In case the LocationPing was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LocationPingUpdateInput, LocationPingUncheckedUpdateInput>
  }

  /**
   * LocationPing delete
   */
  export type LocationPingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
    /**
     * Filter which LocationPing to delete.
     */
    where: LocationPingWhereUniqueInput
  }

  /**
   * LocationPing deleteMany
   */
  export type LocationPingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LocationPings to delete
     */
    where?: LocationPingWhereInput
    /**
     * Limit how many LocationPings to delete.
     */
    limit?: number
  }

  /**
   * LocationPing without action
   */
  export type LocationPingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LocationPing
     */
    select?: LocationPingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LocationPing
     */
    omit?: LocationPingOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LocationPingInclude<ExtArgs> | null
  }


  /**
   * Model ChatConversation
   */

  export type AggregateChatConversation = {
    _count: ChatConversationCountAggregateOutputType | null
    _min: ChatConversationMinAggregateOutputType | null
    _max: ChatConversationMaxAggregateOutputType | null
  }

  export type ChatConversationMinAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driver1Id: string | null
    driver2Id: string | null
  }

  export type ChatConversationMaxAggregateOutputType = {
    id: string | null
    createdAt: Date | null
    updatedAt: Date | null
    driver1Id: string | null
    driver2Id: string | null
  }

  export type ChatConversationCountAggregateOutputType = {
    id: number
    createdAt: number
    updatedAt: number
    driver1Id: number
    driver2Id: number
    _all: number
  }


  export type ChatConversationMinAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    driver1Id?: true
    driver2Id?: true
  }

  export type ChatConversationMaxAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    driver1Id?: true
    driver2Id?: true
  }

  export type ChatConversationCountAggregateInputType = {
    id?: true
    createdAt?: true
    updatedAt?: true
    driver1Id?: true
    driver2Id?: true
    _all?: true
  }

  export type ChatConversationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatConversation to aggregate.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatConversations
    **/
    _count?: true | ChatConversationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatConversationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatConversationMaxAggregateInputType
  }

  export type GetChatConversationAggregateType<T extends ChatConversationAggregateArgs> = {
        [P in keyof T & keyof AggregateChatConversation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatConversation[P]>
      : GetScalarType<T[P], AggregateChatConversation[P]>
  }




  export type ChatConversationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatConversationWhereInput
    orderBy?: ChatConversationOrderByWithAggregationInput | ChatConversationOrderByWithAggregationInput[]
    by: ChatConversationScalarFieldEnum[] | ChatConversationScalarFieldEnum
    having?: ChatConversationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatConversationCountAggregateInputType | true
    _min?: ChatConversationMinAggregateInputType
    _max?: ChatConversationMaxAggregateInputType
  }

  export type ChatConversationGroupByOutputType = {
    id: string
    createdAt: Date
    updatedAt: Date
    driver1Id: string
    driver2Id: string
    _count: ChatConversationCountAggregateOutputType | null
    _min: ChatConversationMinAggregateOutputType | null
    _max: ChatConversationMaxAggregateOutputType | null
  }

  type GetChatConversationGroupByPayload<T extends ChatConversationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatConversationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatConversationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatConversationGroupByOutputType[P]>
            : GetScalarType<T[P], ChatConversationGroupByOutputType[P]>
        }
      >
    >


  export type ChatConversationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driver1Id?: boolean
    driver2Id?: boolean
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
    messages?: boolean | ChatConversation$messagesArgs<ExtArgs>
    _count?: boolean | ChatConversationCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driver1Id?: boolean
    driver2Id?: boolean
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driver1Id?: boolean
    driver2Id?: boolean
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatConversation"]>

  export type ChatConversationSelectScalar = {
    id?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    driver1Id?: boolean
    driver2Id?: boolean
  }

  export type ChatConversationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "createdAt" | "updatedAt" | "driver1Id" | "driver2Id", ExtArgs["result"]["chatConversation"]>
  export type ChatConversationInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
    messages?: boolean | ChatConversation$messagesArgs<ExtArgs>
    _count?: boolean | ChatConversationCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ChatConversationIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
  }
  export type ChatConversationIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    driver1?: boolean | DriverDefaultArgs<ExtArgs>
    driver2?: boolean | DriverDefaultArgs<ExtArgs>
  }

  export type $ChatConversationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatConversation"
    objects: {
      driver1: Prisma.$DriverPayload<ExtArgs>
      driver2: Prisma.$DriverPayload<ExtArgs>
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      createdAt: Date
      updatedAt: Date
      driver1Id: string
      driver2Id: string
    }, ExtArgs["result"]["chatConversation"]>
    composites: {}
  }

  type ChatConversationGetPayload<S extends boolean | null | undefined | ChatConversationDefaultArgs> = $Result.GetResult<Prisma.$ChatConversationPayload, S>

  type ChatConversationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatConversationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatConversationCountAggregateInputType | true
    }

  export interface ChatConversationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatConversation'], meta: { name: 'ChatConversation' } }
    /**
     * Find zero or one ChatConversation that matches the filter.
     * @param {ChatConversationFindUniqueArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatConversationFindUniqueArgs>(args: SelectSubset<T, ChatConversationFindUniqueArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatConversation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatConversationFindUniqueOrThrowArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatConversationFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatConversationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatConversation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindFirstArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatConversationFindFirstArgs>(args?: SelectSubset<T, ChatConversationFindFirstArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatConversation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindFirstOrThrowArgs} args - Arguments to find a ChatConversation
     * @example
     * // Get one ChatConversation
     * const chatConversation = await prisma.chatConversation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatConversationFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatConversationFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatConversations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatConversations
     * const chatConversations = await prisma.chatConversation.findMany()
     * 
     * // Get first 10 ChatConversations
     * const chatConversations = await prisma.chatConversation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatConversationFindManyArgs>(args?: SelectSubset<T, ChatConversationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatConversation.
     * @param {ChatConversationCreateArgs} args - Arguments to create a ChatConversation.
     * @example
     * // Create one ChatConversation
     * const ChatConversation = await prisma.chatConversation.create({
     *   data: {
     *     // ... data to create a ChatConversation
     *   }
     * })
     * 
     */
    create<T extends ChatConversationCreateArgs>(args: SelectSubset<T, ChatConversationCreateArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatConversations.
     * @param {ChatConversationCreateManyArgs} args - Arguments to create many ChatConversations.
     * @example
     * // Create many ChatConversations
     * const chatConversation = await prisma.chatConversation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatConversationCreateManyArgs>(args?: SelectSubset<T, ChatConversationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatConversations and returns the data saved in the database.
     * @param {ChatConversationCreateManyAndReturnArgs} args - Arguments to create many ChatConversations.
     * @example
     * // Create many ChatConversations
     * const chatConversation = await prisma.chatConversation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatConversations and only return the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatConversationCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatConversationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatConversation.
     * @param {ChatConversationDeleteArgs} args - Arguments to delete one ChatConversation.
     * @example
     * // Delete one ChatConversation
     * const ChatConversation = await prisma.chatConversation.delete({
     *   where: {
     *     // ... filter to delete one ChatConversation
     *   }
     * })
     * 
     */
    delete<T extends ChatConversationDeleteArgs>(args: SelectSubset<T, ChatConversationDeleteArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatConversation.
     * @param {ChatConversationUpdateArgs} args - Arguments to update one ChatConversation.
     * @example
     * // Update one ChatConversation
     * const chatConversation = await prisma.chatConversation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatConversationUpdateArgs>(args: SelectSubset<T, ChatConversationUpdateArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatConversations.
     * @param {ChatConversationDeleteManyArgs} args - Arguments to filter ChatConversations to delete.
     * @example
     * // Delete a few ChatConversations
     * const { count } = await prisma.chatConversation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatConversationDeleteManyArgs>(args?: SelectSubset<T, ChatConversationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatConversations
     * const chatConversation = await prisma.chatConversation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatConversationUpdateManyArgs>(args: SelectSubset<T, ChatConversationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatConversations and returns the data updated in the database.
     * @param {ChatConversationUpdateManyAndReturnArgs} args - Arguments to update many ChatConversations.
     * @example
     * // Update many ChatConversations
     * const chatConversation = await prisma.chatConversation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatConversations and only return the `id`
     * const chatConversationWithIdOnly = await prisma.chatConversation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatConversationUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatConversationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatConversation.
     * @param {ChatConversationUpsertArgs} args - Arguments to update or create a ChatConversation.
     * @example
     * // Update or create a ChatConversation
     * const chatConversation = await prisma.chatConversation.upsert({
     *   create: {
     *     // ... data to create a ChatConversation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatConversation we want to update
     *   }
     * })
     */
    upsert<T extends ChatConversationUpsertArgs>(args: SelectSubset<T, ChatConversationUpsertArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatConversations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationCountArgs} args - Arguments to filter ChatConversations to count.
     * @example
     * // Count the number of ChatConversations
     * const count = await prisma.chatConversation.count({
     *   where: {
     *     // ... the filter for the ChatConversations we want to count
     *   }
     * })
    **/
    count<T extends ChatConversationCountArgs>(
      args?: Subset<T, ChatConversationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatConversationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatConversationAggregateArgs>(args: Subset<T, ChatConversationAggregateArgs>): Prisma.PrismaPromise<GetChatConversationAggregateType<T>>

    /**
     * Group by ChatConversation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatConversationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatConversationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatConversationGroupByArgs['orderBy'] }
        : { orderBy?: ChatConversationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatConversationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatConversationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatConversation model
   */
  readonly fields: ChatConversationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatConversation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatConversationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    driver1<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    driver2<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    messages<T extends ChatConversation$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatConversation$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatConversation model
   */
  interface ChatConversationFieldRefs {
    readonly id: FieldRef<"ChatConversation", 'String'>
    readonly createdAt: FieldRef<"ChatConversation", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatConversation", 'DateTime'>
    readonly driver1Id: FieldRef<"ChatConversation", 'String'>
    readonly driver2Id: FieldRef<"ChatConversation", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChatConversation findUnique
   */
  export type ChatConversationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation findUniqueOrThrow
   */
  export type ChatConversationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation findFirst
   */
  export type ChatConversationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatConversations.
     */
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation findFirstOrThrow
   */
  export type ChatConversationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversation to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatConversations.
     */
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation findMany
   */
  export type ChatConversationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter, which ChatConversations to fetch.
     */
    where?: ChatConversationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatConversations to fetch.
     */
    orderBy?: ChatConversationOrderByWithRelationInput | ChatConversationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatConversations.
     */
    cursor?: ChatConversationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatConversations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatConversations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatConversations.
     */
    distinct?: ChatConversationScalarFieldEnum | ChatConversationScalarFieldEnum[]
  }

  /**
   * ChatConversation create
   */
  export type ChatConversationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatConversation.
     */
    data: XOR<ChatConversationCreateInput, ChatConversationUncheckedCreateInput>
  }

  /**
   * ChatConversation createMany
   */
  export type ChatConversationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatConversations.
     */
    data: ChatConversationCreateManyInput | ChatConversationCreateManyInput[]
  }

  /**
   * ChatConversation createManyAndReturn
   */
  export type ChatConversationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * The data used to create many ChatConversations.
     */
    data: ChatConversationCreateManyInput | ChatConversationCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatConversation update
   */
  export type ChatConversationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatConversation.
     */
    data: XOR<ChatConversationUpdateInput, ChatConversationUncheckedUpdateInput>
    /**
     * Choose, which ChatConversation to update.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation updateMany
   */
  export type ChatConversationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatConversations.
     */
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyInput>
    /**
     * Filter which ChatConversations to update
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to update.
     */
    limit?: number
  }

  /**
   * ChatConversation updateManyAndReturn
   */
  export type ChatConversationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * The data used to update ChatConversations.
     */
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyInput>
    /**
     * Filter which ChatConversations to update
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatConversation upsert
   */
  export type ChatConversationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatConversation to update in case it exists.
     */
    where: ChatConversationWhereUniqueInput
    /**
     * In case the ChatConversation found by the `where` argument doesn't exist, create a new ChatConversation with this data.
     */
    create: XOR<ChatConversationCreateInput, ChatConversationUncheckedCreateInput>
    /**
     * In case the ChatConversation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatConversationUpdateInput, ChatConversationUncheckedUpdateInput>
  }

  /**
   * ChatConversation delete
   */
  export type ChatConversationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
    /**
     * Filter which ChatConversation to delete.
     */
    where: ChatConversationWhereUniqueInput
  }

  /**
   * ChatConversation deleteMany
   */
  export type ChatConversationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatConversations to delete
     */
    where?: ChatConversationWhereInput
    /**
     * Limit how many ChatConversations to delete.
     */
    limit?: number
  }

  /**
   * ChatConversation.messages
   */
  export type ChatConversation$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatConversation without action
   */
  export type ChatConversationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatConversation
     */
    select?: ChatConversationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatConversation
     */
    omit?: ChatConversationOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatConversationInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    content: string | null
    mediaUrl: string | null
    mediaType: string | null
    createdAt: Date | null
    read: boolean | null
    senderId: string | null
    conversationId: string | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    content: string | null
    mediaUrl: string | null
    mediaType: string | null
    createdAt: Date | null
    read: boolean | null
    senderId: string | null
    conversationId: string | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    content: number
    mediaUrl: number
    mediaType: number
    createdAt: number
    read: number
    senderId: number
    conversationId: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    content?: true
    mediaUrl?: true
    mediaType?: true
    createdAt?: true
    read?: true
    senderId?: true
    conversationId?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    content?: true
    mediaUrl?: true
    mediaType?: true
    createdAt?: true
    read?: true
    senderId?: true
    conversationId?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    content?: true
    mediaUrl?: true
    mediaType?: true
    createdAt?: true
    read?: true
    senderId?: true
    conversationId?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    content: string
    mediaUrl: string | null
    mediaType: string | null
    createdAt: Date
    read: boolean
    senderId: string
    conversationId: string
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    createdAt?: boolean
    read?: boolean
    senderId?: boolean
    conversationId?: boolean
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    createdAt?: boolean
    read?: boolean
    senderId?: boolean
    conversationId?: boolean
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    content?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    createdAt?: boolean
    read?: boolean
    senderId?: boolean
    conversationId?: boolean
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    content?: boolean
    mediaUrl?: boolean
    mediaType?: boolean
    createdAt?: boolean
    read?: boolean
    senderId?: boolean
    conversationId?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "content" | "mediaUrl" | "mediaType" | "createdAt" | "read" | "senderId" | "conversationId", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    sender?: boolean | DriverDefaultArgs<ExtArgs>
    conversation?: boolean | ChatConversationDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      sender: Prisma.$DriverPayload<ExtArgs>
      conversation: Prisma.$ChatConversationPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      content: string
      mediaUrl: string | null
      mediaType: string | null
      createdAt: Date
      read: boolean
      senderId: string
      conversationId: string
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    sender<T extends DriverDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DriverDefaultArgs<ExtArgs>>): Prisma__DriverClient<$Result.GetResult<Prisma.$DriverPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    conversation<T extends ChatConversationDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatConversationDefaultArgs<ExtArgs>>): Prisma__ChatConversationClient<$Result.GetResult<Prisma.$ChatConversationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly mediaUrl: FieldRef<"ChatMessage", 'String'>
    readonly mediaType: FieldRef<"ChatMessage", 'String'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
    readonly read: FieldRef<"ChatMessage", 'Boolean'>
    readonly senderId: FieldRef<"ChatMessage", 'String'>
    readonly conversationId: FieldRef<"ChatMessage", 'String'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const AdminScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    passwordHash: 'passwordHash',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AdminScalarFieldEnum = (typeof AdminScalarFieldEnum)[keyof typeof AdminScalarFieldEnum]


  export const DriverScalarFieldEnum: {
    id: 'id',
    name: 'name',
    phone: 'phone',
    email: 'email',
    licenseDocUrl: 'licenseDocUrl',
    ghanaCardUrl: 'ghanaCardUrl',
    irisScanUrl: 'irisScanUrl',
    status: 'status',
    balance: 'balance',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    passwordHash: 'passwordHash'
  };

  export type DriverScalarFieldEnum = (typeof DriverScalarFieldEnum)[keyof typeof DriverScalarFieldEnum]


  export const VehicleScalarFieldEnum: {
    id: 'id',
    plateNumber: 'plateNumber',
    make: 'make',
    model: 'model',
    year: 'year',
    severityStatus: 'severityStatus',
    gpsDeviceId: 'gpsDeviceId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    assignedDriverId: 'assignedDriverId'
  };

  export type VehicleScalarFieldEnum = (typeof VehicleScalarFieldEnum)[keyof typeof VehicleScalarFieldEnum]


  export const ApplicationScalarFieldEnum: {
    id: 'id',
    fullName: 'fullName',
    phone: 'phone',
    email: 'email',
    reason: 'reason',
    licenseDocUrl: 'licenseDocUrl',
    ghanaCardUrl: 'ghanaCardUrl',
    irisScanUrl: 'irisScanUrl',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    approvedDriverId: 'approvedDriverId'
  };

  export type ApplicationScalarFieldEnum = (typeof ApplicationScalarFieldEnum)[keyof typeof ApplicationScalarFieldEnum]


  export const DriverReportScalarFieldEnum: {
    id: 'id',
    type: 'type',
    description: 'description',
    photoUrl: 'photoUrl',
    suggestedSeverity: 'suggestedSeverity',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    driverId: 'driverId',
    vehicleId: 'vehicleId'
  };

  export type DriverReportScalarFieldEnum = (typeof DriverReportScalarFieldEnum)[keyof typeof DriverReportScalarFieldEnum]


  export const PartsExchangeScalarFieldEnum: {
    id: 'id',
    partName: 'partName',
    cost: 'cost',
    date: 'date',
    photoUrl: 'photoUrl',
    receiptUrl: 'receiptUrl',
    reimbursementStatus: 'reimbursementStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    driverId: 'driverId',
    vehicleId: 'vehicleId'
  };

  export type PartsExchangeScalarFieldEnum = (typeof PartsExchangeScalarFieldEnum)[keyof typeof PartsExchangeScalarFieldEnum]


  export const SalesRecordScalarFieldEnum: {
    id: 'id',
    weekLabel: 'weekLabel',
    amount: 'amount',
    paymentMethod: 'paymentMethod',
    momoReference: 'momoReference',
    confirmationStatus: 'confirmationStatus',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    driverId: 'driverId'
  };

  export type SalesRecordScalarFieldEnum = (typeof SalesRecordScalarFieldEnum)[keyof typeof SalesRecordScalarFieldEnum]


  export const LedgerEntryScalarFieldEnum: {
    id: 'id',
    amount: 'amount',
    direction: 'direction',
    description: 'description',
    createdAt: 'createdAt',
    driverId: 'driverId'
  };

  export type LedgerEntryScalarFieldEnum = (typeof LedgerEntryScalarFieldEnum)[keyof typeof LedgerEntryScalarFieldEnum]


  export const LocationPingScalarFieldEnum: {
    id: 'id',
    lat: 'lat',
    lng: 'lng',
    timestamp: 'timestamp',
    vehicleId: 'vehicleId',
    gpsDeviceId: 'gpsDeviceId'
  };

  export type LocationPingScalarFieldEnum = (typeof LocationPingScalarFieldEnum)[keyof typeof LocationPingScalarFieldEnum]


  export const ChatConversationScalarFieldEnum: {
    id: 'id',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    driver1Id: 'driver1Id',
    driver2Id: 'driver2Id'
  };

  export type ChatConversationScalarFieldEnum = (typeof ChatConversationScalarFieldEnum)[keyof typeof ChatConversationScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    content: 'content',
    mediaUrl: 'mediaUrl',
    mediaType: 'mediaType',
    createdAt: 'createdAt',
    read: 'read',
    senderId: 'senderId',
    conversationId: 'conversationId'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
  /**
   * Deep Input Types
   */


  export type AdminWhereInput = {
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    id?: StringFilter<"Admin"> | string
    name?: StringFilter<"Admin"> | string
    email?: StringFilter<"Admin"> | string
    passwordHash?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }

  export type AdminOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: AdminWhereInput | AdminWhereInput[]
    OR?: AdminWhereInput[]
    NOT?: AdminWhereInput | AdminWhereInput[]
    name?: StringFilter<"Admin"> | string
    passwordHash?: StringFilter<"Admin"> | string
    createdAt?: DateTimeFilter<"Admin"> | Date | string
    updatedAt?: DateTimeFilter<"Admin"> | Date | string
  }, "id" | "email">

  export type AdminOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AdminCountOrderByAggregateInput
    _max?: AdminMaxOrderByAggregateInput
    _min?: AdminMinOrderByAggregateInput
  }

  export type AdminScalarWhereWithAggregatesInput = {
    AND?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    OR?: AdminScalarWhereWithAggregatesInput[]
    NOT?: AdminScalarWhereWithAggregatesInput | AdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Admin"> | string
    name?: StringWithAggregatesFilter<"Admin"> | string
    email?: StringWithAggregatesFilter<"Admin"> | string
    passwordHash?: StringWithAggregatesFilter<"Admin"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Admin"> | Date | string
  }

  export type DriverWhereInput = {
    AND?: DriverWhereInput | DriverWhereInput[]
    OR?: DriverWhereInput[]
    NOT?: DriverWhereInput | DriverWhereInput[]
    id?: StringFilter<"Driver"> | string
    name?: StringFilter<"Driver"> | string
    phone?: StringFilter<"Driver"> | string
    email?: StringNullableFilter<"Driver"> | string | null
    licenseDocUrl?: StringNullableFilter<"Driver"> | string | null
    ghanaCardUrl?: StringNullableFilter<"Driver"> | string | null
    irisScanUrl?: StringNullableFilter<"Driver"> | string | null
    status?: StringFilter<"Driver"> | string
    balance?: FloatFilter<"Driver"> | number
    createdAt?: DateTimeFilter<"Driver"> | Date | string
    updatedAt?: DateTimeFilter<"Driver"> | Date | string
    passwordHash?: StringFilter<"Driver"> | string
    assignedVehicle?: XOR<VehicleNullableScalarRelationFilter, VehicleWhereInput> | null
    reports?: DriverReportListRelationFilter
    partsExchanges?: PartsExchangeListRelationFilter
    salesRecords?: SalesRecordListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
    applicationRef?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    sentMessages?: ChatMessageListRelationFilter
    conversations1?: ChatConversationListRelationFilter
    conversations2?: ChatConversationListRelationFilter
  }

  export type DriverOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    licenseDocUrl?: SortOrderInput | SortOrder
    ghanaCardUrl?: SortOrderInput | SortOrder
    irisScanUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordHash?: SortOrder
    assignedVehicle?: VehicleOrderByWithRelationInput
    reports?: DriverReportOrderByRelationAggregateInput
    partsExchanges?: PartsExchangeOrderByRelationAggregateInput
    salesRecords?: SalesRecordOrderByRelationAggregateInput
    ledgerEntries?: LedgerEntryOrderByRelationAggregateInput
    applicationRef?: ApplicationOrderByWithRelationInput
    sentMessages?: ChatMessageOrderByRelationAggregateInput
    conversations1?: ChatConversationOrderByRelationAggregateInput
    conversations2?: ChatConversationOrderByRelationAggregateInput
  }

  export type DriverWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DriverWhereInput | DriverWhereInput[]
    OR?: DriverWhereInput[]
    NOT?: DriverWhereInput | DriverWhereInput[]
    name?: StringFilter<"Driver"> | string
    phone?: StringFilter<"Driver"> | string
    email?: StringNullableFilter<"Driver"> | string | null
    licenseDocUrl?: StringNullableFilter<"Driver"> | string | null
    ghanaCardUrl?: StringNullableFilter<"Driver"> | string | null
    irisScanUrl?: StringNullableFilter<"Driver"> | string | null
    status?: StringFilter<"Driver"> | string
    balance?: FloatFilter<"Driver"> | number
    createdAt?: DateTimeFilter<"Driver"> | Date | string
    updatedAt?: DateTimeFilter<"Driver"> | Date | string
    passwordHash?: StringFilter<"Driver"> | string
    assignedVehicle?: XOR<VehicleNullableScalarRelationFilter, VehicleWhereInput> | null
    reports?: DriverReportListRelationFilter
    partsExchanges?: PartsExchangeListRelationFilter
    salesRecords?: SalesRecordListRelationFilter
    ledgerEntries?: LedgerEntryListRelationFilter
    applicationRef?: XOR<ApplicationNullableScalarRelationFilter, ApplicationWhereInput> | null
    sentMessages?: ChatMessageListRelationFilter
    conversations1?: ChatConversationListRelationFilter
    conversations2?: ChatConversationListRelationFilter
  }, "id">

  export type DriverOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    licenseDocUrl?: SortOrderInput | SortOrder
    ghanaCardUrl?: SortOrderInput | SortOrder
    irisScanUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordHash?: SortOrder
    _count?: DriverCountOrderByAggregateInput
    _avg?: DriverAvgOrderByAggregateInput
    _max?: DriverMaxOrderByAggregateInput
    _min?: DriverMinOrderByAggregateInput
    _sum?: DriverSumOrderByAggregateInput
  }

  export type DriverScalarWhereWithAggregatesInput = {
    AND?: DriverScalarWhereWithAggregatesInput | DriverScalarWhereWithAggregatesInput[]
    OR?: DriverScalarWhereWithAggregatesInput[]
    NOT?: DriverScalarWhereWithAggregatesInput | DriverScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Driver"> | string
    name?: StringWithAggregatesFilter<"Driver"> | string
    phone?: StringWithAggregatesFilter<"Driver"> | string
    email?: StringNullableWithAggregatesFilter<"Driver"> | string | null
    licenseDocUrl?: StringNullableWithAggregatesFilter<"Driver"> | string | null
    ghanaCardUrl?: StringNullableWithAggregatesFilter<"Driver"> | string | null
    irisScanUrl?: StringNullableWithAggregatesFilter<"Driver"> | string | null
    status?: StringWithAggregatesFilter<"Driver"> | string
    balance?: FloatWithAggregatesFilter<"Driver"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Driver"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Driver"> | Date | string
    passwordHash?: StringWithAggregatesFilter<"Driver"> | string
  }

  export type VehicleWhereInput = {
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    id?: StringFilter<"Vehicle"> | string
    plateNumber?: StringFilter<"Vehicle"> | string
    make?: StringFilter<"Vehicle"> | string
    model?: StringFilter<"Vehicle"> | string
    year?: IntFilter<"Vehicle"> | number
    severityStatus?: StringFilter<"Vehicle"> | string
    gpsDeviceId?: StringNullableFilter<"Vehicle"> | string | null
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    assignedDriverId?: StringNullableFilter<"Vehicle"> | string | null
    assignedDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
    reports?: DriverReportListRelationFilter
    partsExchanges?: PartsExchangeListRelationFilter
    locationPings?: LocationPingListRelationFilter
  }

  export type VehicleOrderByWithRelationInput = {
    id?: SortOrder
    plateNumber?: SortOrder
    make?: SortOrder
    model?: SortOrder
    year?: SortOrder
    severityStatus?: SortOrder
    gpsDeviceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignedDriverId?: SortOrderInput | SortOrder
    assignedDriver?: DriverOrderByWithRelationInput
    reports?: DriverReportOrderByRelationAggregateInput
    partsExchanges?: PartsExchangeOrderByRelationAggregateInput
    locationPings?: LocationPingOrderByRelationAggregateInput
  }

  export type VehicleWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    plateNumber?: string
    assignedDriverId?: string
    AND?: VehicleWhereInput | VehicleWhereInput[]
    OR?: VehicleWhereInput[]
    NOT?: VehicleWhereInput | VehicleWhereInput[]
    make?: StringFilter<"Vehicle"> | string
    model?: StringFilter<"Vehicle"> | string
    year?: IntFilter<"Vehicle"> | number
    severityStatus?: StringFilter<"Vehicle"> | string
    gpsDeviceId?: StringNullableFilter<"Vehicle"> | string | null
    createdAt?: DateTimeFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeFilter<"Vehicle"> | Date | string
    assignedDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
    reports?: DriverReportListRelationFilter
    partsExchanges?: PartsExchangeListRelationFilter
    locationPings?: LocationPingListRelationFilter
  }, "id" | "plateNumber" | "assignedDriverId">

  export type VehicleOrderByWithAggregationInput = {
    id?: SortOrder
    plateNumber?: SortOrder
    make?: SortOrder
    model?: SortOrder
    year?: SortOrder
    severityStatus?: SortOrder
    gpsDeviceId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignedDriverId?: SortOrderInput | SortOrder
    _count?: VehicleCountOrderByAggregateInput
    _avg?: VehicleAvgOrderByAggregateInput
    _max?: VehicleMaxOrderByAggregateInput
    _min?: VehicleMinOrderByAggregateInput
    _sum?: VehicleSumOrderByAggregateInput
  }

  export type VehicleScalarWhereWithAggregatesInput = {
    AND?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    OR?: VehicleScalarWhereWithAggregatesInput[]
    NOT?: VehicleScalarWhereWithAggregatesInput | VehicleScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Vehicle"> | string
    plateNumber?: StringWithAggregatesFilter<"Vehicle"> | string
    make?: StringWithAggregatesFilter<"Vehicle"> | string
    model?: StringWithAggregatesFilter<"Vehicle"> | string
    year?: IntWithAggregatesFilter<"Vehicle"> | number
    severityStatus?: StringWithAggregatesFilter<"Vehicle"> | string
    gpsDeviceId?: StringNullableWithAggregatesFilter<"Vehicle"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Vehicle"> | Date | string
    assignedDriverId?: StringNullableWithAggregatesFilter<"Vehicle"> | string | null
  }

  export type ApplicationWhereInput = {
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    id?: StringFilter<"Application"> | string
    fullName?: StringFilter<"Application"> | string
    phone?: StringFilter<"Application"> | string
    email?: StringNullableFilter<"Application"> | string | null
    reason?: StringFilter<"Application"> | string
    licenseDocUrl?: StringNullableFilter<"Application"> | string | null
    ghanaCardUrl?: StringNullableFilter<"Application"> | string | null
    irisScanUrl?: StringNullableFilter<"Application"> | string | null
    status?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    approvedDriverId?: StringNullableFilter<"Application"> | string | null
    approvedDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
  }

  export type ApplicationOrderByWithRelationInput = {
    id?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    reason?: SortOrder
    licenseDocUrl?: SortOrderInput | SortOrder
    ghanaCardUrl?: SortOrderInput | SortOrder
    irisScanUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedDriverId?: SortOrderInput | SortOrder
    approvedDriver?: DriverOrderByWithRelationInput
  }

  export type ApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    approvedDriverId?: string
    AND?: ApplicationWhereInput | ApplicationWhereInput[]
    OR?: ApplicationWhereInput[]
    NOT?: ApplicationWhereInput | ApplicationWhereInput[]
    fullName?: StringFilter<"Application"> | string
    phone?: StringFilter<"Application"> | string
    email?: StringNullableFilter<"Application"> | string | null
    reason?: StringFilter<"Application"> | string
    licenseDocUrl?: StringNullableFilter<"Application"> | string | null
    ghanaCardUrl?: StringNullableFilter<"Application"> | string | null
    irisScanUrl?: StringNullableFilter<"Application"> | string | null
    status?: StringFilter<"Application"> | string
    createdAt?: DateTimeFilter<"Application"> | Date | string
    updatedAt?: DateTimeFilter<"Application"> | Date | string
    approvedDriver?: XOR<DriverNullableScalarRelationFilter, DriverWhereInput> | null
  }, "id" | "approvedDriverId">

  export type ApplicationOrderByWithAggregationInput = {
    id?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    email?: SortOrderInput | SortOrder
    reason?: SortOrder
    licenseDocUrl?: SortOrderInput | SortOrder
    ghanaCardUrl?: SortOrderInput | SortOrder
    irisScanUrl?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedDriverId?: SortOrderInput | SortOrder
    _count?: ApplicationCountOrderByAggregateInput
    _max?: ApplicationMaxOrderByAggregateInput
    _min?: ApplicationMinOrderByAggregateInput
  }

  export type ApplicationScalarWhereWithAggregatesInput = {
    AND?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    OR?: ApplicationScalarWhereWithAggregatesInput[]
    NOT?: ApplicationScalarWhereWithAggregatesInput | ApplicationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Application"> | string
    fullName?: StringWithAggregatesFilter<"Application"> | string
    phone?: StringWithAggregatesFilter<"Application"> | string
    email?: StringNullableWithAggregatesFilter<"Application"> | string | null
    reason?: StringWithAggregatesFilter<"Application"> | string
    licenseDocUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    ghanaCardUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    irisScanUrl?: StringNullableWithAggregatesFilter<"Application"> | string | null
    status?: StringWithAggregatesFilter<"Application"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Application"> | Date | string
    approvedDriverId?: StringNullableWithAggregatesFilter<"Application"> | string | null
  }

  export type DriverReportWhereInput = {
    AND?: DriverReportWhereInput | DriverReportWhereInput[]
    OR?: DriverReportWhereInput[]
    NOT?: DriverReportWhereInput | DriverReportWhereInput[]
    id?: StringFilter<"DriverReport"> | string
    type?: StringFilter<"DriverReport"> | string
    description?: StringFilter<"DriverReport"> | string
    photoUrl?: StringNullableFilter<"DriverReport"> | string | null
    suggestedSeverity?: StringNullableFilter<"DriverReport"> | string | null
    status?: StringFilter<"DriverReport"> | string
    createdAt?: DateTimeFilter<"DriverReport"> | Date | string
    updatedAt?: DateTimeFilter<"DriverReport"> | Date | string
    driverId?: StringFilter<"DriverReport"> | string
    vehicleId?: StringNullableFilter<"DriverReport"> | string | null
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    vehicle?: XOR<VehicleNullableScalarRelationFilter, VehicleWhereInput> | null
  }

  export type DriverReportOrderByWithRelationInput = {
    id?: SortOrder
    type?: SortOrder
    description?: SortOrder
    photoUrl?: SortOrderInput | SortOrder
    suggestedSeverity?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrderInput | SortOrder
    driver?: DriverOrderByWithRelationInput
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type DriverReportWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DriverReportWhereInput | DriverReportWhereInput[]
    OR?: DriverReportWhereInput[]
    NOT?: DriverReportWhereInput | DriverReportWhereInput[]
    type?: StringFilter<"DriverReport"> | string
    description?: StringFilter<"DriverReport"> | string
    photoUrl?: StringNullableFilter<"DriverReport"> | string | null
    suggestedSeverity?: StringNullableFilter<"DriverReport"> | string | null
    status?: StringFilter<"DriverReport"> | string
    createdAt?: DateTimeFilter<"DriverReport"> | Date | string
    updatedAt?: DateTimeFilter<"DriverReport"> | Date | string
    driverId?: StringFilter<"DriverReport"> | string
    vehicleId?: StringNullableFilter<"DriverReport"> | string | null
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    vehicle?: XOR<VehicleNullableScalarRelationFilter, VehicleWhereInput> | null
  }, "id">

  export type DriverReportOrderByWithAggregationInput = {
    id?: SortOrder
    type?: SortOrder
    description?: SortOrder
    photoUrl?: SortOrderInput | SortOrder
    suggestedSeverity?: SortOrderInput | SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrderInput | SortOrder
    _count?: DriverReportCountOrderByAggregateInput
    _max?: DriverReportMaxOrderByAggregateInput
    _min?: DriverReportMinOrderByAggregateInput
  }

  export type DriverReportScalarWhereWithAggregatesInput = {
    AND?: DriverReportScalarWhereWithAggregatesInput | DriverReportScalarWhereWithAggregatesInput[]
    OR?: DriverReportScalarWhereWithAggregatesInput[]
    NOT?: DriverReportScalarWhereWithAggregatesInput | DriverReportScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DriverReport"> | string
    type?: StringWithAggregatesFilter<"DriverReport"> | string
    description?: StringWithAggregatesFilter<"DriverReport"> | string
    photoUrl?: StringNullableWithAggregatesFilter<"DriverReport"> | string | null
    suggestedSeverity?: StringNullableWithAggregatesFilter<"DriverReport"> | string | null
    status?: StringWithAggregatesFilter<"DriverReport"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DriverReport"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"DriverReport"> | Date | string
    driverId?: StringWithAggregatesFilter<"DriverReport"> | string
    vehicleId?: StringNullableWithAggregatesFilter<"DriverReport"> | string | null
  }

  export type PartsExchangeWhereInput = {
    AND?: PartsExchangeWhereInput | PartsExchangeWhereInput[]
    OR?: PartsExchangeWhereInput[]
    NOT?: PartsExchangeWhereInput | PartsExchangeWhereInput[]
    id?: StringFilter<"PartsExchange"> | string
    partName?: StringFilter<"PartsExchange"> | string
    cost?: FloatFilter<"PartsExchange"> | number
    date?: DateTimeFilter<"PartsExchange"> | Date | string
    photoUrl?: StringNullableFilter<"PartsExchange"> | string | null
    receiptUrl?: StringNullableFilter<"PartsExchange"> | string | null
    reimbursementStatus?: StringFilter<"PartsExchange"> | string
    createdAt?: DateTimeFilter<"PartsExchange"> | Date | string
    updatedAt?: DateTimeFilter<"PartsExchange"> | Date | string
    driverId?: StringFilter<"PartsExchange"> | string
    vehicleId?: StringFilter<"PartsExchange"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type PartsExchangeOrderByWithRelationInput = {
    id?: SortOrder
    partName?: SortOrder
    cost?: SortOrder
    date?: SortOrder
    photoUrl?: SortOrderInput | SortOrder
    receiptUrl?: SortOrderInput | SortOrder
    reimbursementStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
    driver?: DriverOrderByWithRelationInput
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type PartsExchangeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PartsExchangeWhereInput | PartsExchangeWhereInput[]
    OR?: PartsExchangeWhereInput[]
    NOT?: PartsExchangeWhereInput | PartsExchangeWhereInput[]
    partName?: StringFilter<"PartsExchange"> | string
    cost?: FloatFilter<"PartsExchange"> | number
    date?: DateTimeFilter<"PartsExchange"> | Date | string
    photoUrl?: StringNullableFilter<"PartsExchange"> | string | null
    receiptUrl?: StringNullableFilter<"PartsExchange"> | string | null
    reimbursementStatus?: StringFilter<"PartsExchange"> | string
    createdAt?: DateTimeFilter<"PartsExchange"> | Date | string
    updatedAt?: DateTimeFilter<"PartsExchange"> | Date | string
    driverId?: StringFilter<"PartsExchange"> | string
    vehicleId?: StringFilter<"PartsExchange"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type PartsExchangeOrderByWithAggregationInput = {
    id?: SortOrder
    partName?: SortOrder
    cost?: SortOrder
    date?: SortOrder
    photoUrl?: SortOrderInput | SortOrder
    receiptUrl?: SortOrderInput | SortOrder
    reimbursementStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
    _count?: PartsExchangeCountOrderByAggregateInput
    _avg?: PartsExchangeAvgOrderByAggregateInput
    _max?: PartsExchangeMaxOrderByAggregateInput
    _min?: PartsExchangeMinOrderByAggregateInput
    _sum?: PartsExchangeSumOrderByAggregateInput
  }

  export type PartsExchangeScalarWhereWithAggregatesInput = {
    AND?: PartsExchangeScalarWhereWithAggregatesInput | PartsExchangeScalarWhereWithAggregatesInput[]
    OR?: PartsExchangeScalarWhereWithAggregatesInput[]
    NOT?: PartsExchangeScalarWhereWithAggregatesInput | PartsExchangeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PartsExchange"> | string
    partName?: StringWithAggregatesFilter<"PartsExchange"> | string
    cost?: FloatWithAggregatesFilter<"PartsExchange"> | number
    date?: DateTimeWithAggregatesFilter<"PartsExchange"> | Date | string
    photoUrl?: StringNullableWithAggregatesFilter<"PartsExchange"> | string | null
    receiptUrl?: StringNullableWithAggregatesFilter<"PartsExchange"> | string | null
    reimbursementStatus?: StringWithAggregatesFilter<"PartsExchange"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PartsExchange"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"PartsExchange"> | Date | string
    driverId?: StringWithAggregatesFilter<"PartsExchange"> | string
    vehicleId?: StringWithAggregatesFilter<"PartsExchange"> | string
  }

  export type SalesRecordWhereInput = {
    AND?: SalesRecordWhereInput | SalesRecordWhereInput[]
    OR?: SalesRecordWhereInput[]
    NOT?: SalesRecordWhereInput | SalesRecordWhereInput[]
    id?: StringFilter<"SalesRecord"> | string
    weekLabel?: StringFilter<"SalesRecord"> | string
    amount?: FloatFilter<"SalesRecord"> | number
    paymentMethod?: StringFilter<"SalesRecord"> | string
    momoReference?: StringNullableFilter<"SalesRecord"> | string | null
    confirmationStatus?: StringFilter<"SalesRecord"> | string
    createdAt?: DateTimeFilter<"SalesRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SalesRecord"> | Date | string
    driverId?: StringFilter<"SalesRecord"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }

  export type SalesRecordOrderByWithRelationInput = {
    id?: SortOrder
    weekLabel?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    momoReference?: SortOrderInput | SortOrder
    confirmationStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    driver?: DriverOrderByWithRelationInput
  }

  export type SalesRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: SalesRecordWhereInput | SalesRecordWhereInput[]
    OR?: SalesRecordWhereInput[]
    NOT?: SalesRecordWhereInput | SalesRecordWhereInput[]
    weekLabel?: StringFilter<"SalesRecord"> | string
    amount?: FloatFilter<"SalesRecord"> | number
    paymentMethod?: StringFilter<"SalesRecord"> | string
    momoReference?: StringNullableFilter<"SalesRecord"> | string | null
    confirmationStatus?: StringFilter<"SalesRecord"> | string
    createdAt?: DateTimeFilter<"SalesRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SalesRecord"> | Date | string
    driverId?: StringFilter<"SalesRecord"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }, "id">

  export type SalesRecordOrderByWithAggregationInput = {
    id?: SortOrder
    weekLabel?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    momoReference?: SortOrderInput | SortOrder
    confirmationStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    _count?: SalesRecordCountOrderByAggregateInput
    _avg?: SalesRecordAvgOrderByAggregateInput
    _max?: SalesRecordMaxOrderByAggregateInput
    _min?: SalesRecordMinOrderByAggregateInput
    _sum?: SalesRecordSumOrderByAggregateInput
  }

  export type SalesRecordScalarWhereWithAggregatesInput = {
    AND?: SalesRecordScalarWhereWithAggregatesInput | SalesRecordScalarWhereWithAggregatesInput[]
    OR?: SalesRecordScalarWhereWithAggregatesInput[]
    NOT?: SalesRecordScalarWhereWithAggregatesInput | SalesRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SalesRecord"> | string
    weekLabel?: StringWithAggregatesFilter<"SalesRecord"> | string
    amount?: FloatWithAggregatesFilter<"SalesRecord"> | number
    paymentMethod?: StringWithAggregatesFilter<"SalesRecord"> | string
    momoReference?: StringNullableWithAggregatesFilter<"SalesRecord"> | string | null
    confirmationStatus?: StringWithAggregatesFilter<"SalesRecord"> | string
    createdAt?: DateTimeWithAggregatesFilter<"SalesRecord"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SalesRecord"> | Date | string
    driverId?: StringWithAggregatesFilter<"SalesRecord"> | string
  }

  export type LedgerEntryWhereInput = {
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    id?: StringFilter<"LedgerEntry"> | string
    amount?: FloatFilter<"LedgerEntry"> | number
    direction?: StringFilter<"LedgerEntry"> | string
    description?: StringFilter<"LedgerEntry"> | string
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
    driverId?: StringFilter<"LedgerEntry"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }

  export type LedgerEntryOrderByWithRelationInput = {
    id?: SortOrder
    amount?: SortOrder
    direction?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    driverId?: SortOrder
    driver?: DriverOrderByWithRelationInput
  }

  export type LedgerEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    OR?: LedgerEntryWhereInput[]
    NOT?: LedgerEntryWhereInput | LedgerEntryWhereInput[]
    amount?: FloatFilter<"LedgerEntry"> | number
    direction?: StringFilter<"LedgerEntry"> | string
    description?: StringFilter<"LedgerEntry"> | string
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
    driverId?: StringFilter<"LedgerEntry"> | string
    driver?: XOR<DriverScalarRelationFilter, DriverWhereInput>
  }, "id">

  export type LedgerEntryOrderByWithAggregationInput = {
    id?: SortOrder
    amount?: SortOrder
    direction?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    driverId?: SortOrder
    _count?: LedgerEntryCountOrderByAggregateInput
    _avg?: LedgerEntryAvgOrderByAggregateInput
    _max?: LedgerEntryMaxOrderByAggregateInput
    _min?: LedgerEntryMinOrderByAggregateInput
    _sum?: LedgerEntrySumOrderByAggregateInput
  }

  export type LedgerEntryScalarWhereWithAggregatesInput = {
    AND?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    OR?: LedgerEntryScalarWhereWithAggregatesInput[]
    NOT?: LedgerEntryScalarWhereWithAggregatesInput | LedgerEntryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LedgerEntry"> | string
    amount?: FloatWithAggregatesFilter<"LedgerEntry"> | number
    direction?: StringWithAggregatesFilter<"LedgerEntry"> | string
    description?: StringWithAggregatesFilter<"LedgerEntry"> | string
    createdAt?: DateTimeWithAggregatesFilter<"LedgerEntry"> | Date | string
    driverId?: StringWithAggregatesFilter<"LedgerEntry"> | string
  }

  export type LocationPingWhereInput = {
    AND?: LocationPingWhereInput | LocationPingWhereInput[]
    OR?: LocationPingWhereInput[]
    NOT?: LocationPingWhereInput | LocationPingWhereInput[]
    id?: StringFilter<"LocationPing"> | string
    lat?: FloatFilter<"LocationPing"> | number
    lng?: FloatFilter<"LocationPing"> | number
    timestamp?: DateTimeFilter<"LocationPing"> | Date | string
    vehicleId?: StringFilter<"LocationPing"> | string
    gpsDeviceId?: StringNullableFilter<"LocationPing"> | string | null
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }

  export type LocationPingOrderByWithRelationInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    timestamp?: SortOrder
    vehicleId?: SortOrder
    gpsDeviceId?: SortOrderInput | SortOrder
    vehicle?: VehicleOrderByWithRelationInput
  }

  export type LocationPingWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LocationPingWhereInput | LocationPingWhereInput[]
    OR?: LocationPingWhereInput[]
    NOT?: LocationPingWhereInput | LocationPingWhereInput[]
    lat?: FloatFilter<"LocationPing"> | number
    lng?: FloatFilter<"LocationPing"> | number
    timestamp?: DateTimeFilter<"LocationPing"> | Date | string
    vehicleId?: StringFilter<"LocationPing"> | string
    gpsDeviceId?: StringNullableFilter<"LocationPing"> | string | null
    vehicle?: XOR<VehicleScalarRelationFilter, VehicleWhereInput>
  }, "id">

  export type LocationPingOrderByWithAggregationInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    timestamp?: SortOrder
    vehicleId?: SortOrder
    gpsDeviceId?: SortOrderInput | SortOrder
    _count?: LocationPingCountOrderByAggregateInput
    _avg?: LocationPingAvgOrderByAggregateInput
    _max?: LocationPingMaxOrderByAggregateInput
    _min?: LocationPingMinOrderByAggregateInput
    _sum?: LocationPingSumOrderByAggregateInput
  }

  export type LocationPingScalarWhereWithAggregatesInput = {
    AND?: LocationPingScalarWhereWithAggregatesInput | LocationPingScalarWhereWithAggregatesInput[]
    OR?: LocationPingScalarWhereWithAggregatesInput[]
    NOT?: LocationPingScalarWhereWithAggregatesInput | LocationPingScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LocationPing"> | string
    lat?: FloatWithAggregatesFilter<"LocationPing"> | number
    lng?: FloatWithAggregatesFilter<"LocationPing"> | number
    timestamp?: DateTimeWithAggregatesFilter<"LocationPing"> | Date | string
    vehicleId?: StringWithAggregatesFilter<"LocationPing"> | string
    gpsDeviceId?: StringNullableWithAggregatesFilter<"LocationPing"> | string | null
  }

  export type ChatConversationWhereInput = {
    AND?: ChatConversationWhereInput | ChatConversationWhereInput[]
    OR?: ChatConversationWhereInput[]
    NOT?: ChatConversationWhereInput | ChatConversationWhereInput[]
    id?: StringFilter<"ChatConversation"> | string
    createdAt?: DateTimeFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ChatConversation"> | Date | string
    driver1Id?: StringFilter<"ChatConversation"> | string
    driver2Id?: StringFilter<"ChatConversation"> | string
    driver1?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    driver2?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    messages?: ChatMessageListRelationFilter
  }

  export type ChatConversationOrderByWithRelationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driver1Id?: SortOrder
    driver2Id?: SortOrder
    driver1?: DriverOrderByWithRelationInput
    driver2?: DriverOrderByWithRelationInput
    messages?: ChatMessageOrderByRelationAggregateInput
  }

  export type ChatConversationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    driver1Id_driver2Id?: ChatConversationDriver1IdDriver2IdCompoundUniqueInput
    AND?: ChatConversationWhereInput | ChatConversationWhereInput[]
    OR?: ChatConversationWhereInput[]
    NOT?: ChatConversationWhereInput | ChatConversationWhereInput[]
    createdAt?: DateTimeFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ChatConversation"> | Date | string
    driver1Id?: StringFilter<"ChatConversation"> | string
    driver2Id?: StringFilter<"ChatConversation"> | string
    driver1?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    driver2?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    messages?: ChatMessageListRelationFilter
  }, "id" | "driver1Id_driver2Id">

  export type ChatConversationOrderByWithAggregationInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driver1Id?: SortOrder
    driver2Id?: SortOrder
    _count?: ChatConversationCountOrderByAggregateInput
    _max?: ChatConversationMaxOrderByAggregateInput
    _min?: ChatConversationMinOrderByAggregateInput
  }

  export type ChatConversationScalarWhereWithAggregatesInput = {
    AND?: ChatConversationScalarWhereWithAggregatesInput | ChatConversationScalarWhereWithAggregatesInput[]
    OR?: ChatConversationScalarWhereWithAggregatesInput[]
    NOT?: ChatConversationScalarWhereWithAggregatesInput | ChatConversationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatConversation"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatConversation"> | Date | string
    driver1Id?: StringWithAggregatesFilter<"ChatConversation"> | string
    driver2Id?: StringWithAggregatesFilter<"ChatConversation"> | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    mediaUrl?: StringNullableFilter<"ChatMessage"> | string | null
    mediaType?: StringNullableFilter<"ChatMessage"> | string | null
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    read?: BoolFilter<"ChatMessage"> | boolean
    senderId?: StringFilter<"ChatMessage"> | string
    conversationId?: StringFilter<"ChatMessage"> | string
    sender?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    conversation?: XOR<ChatConversationScalarRelationFilter, ChatConversationWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    mediaType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    read?: SortOrder
    senderId?: SortOrder
    conversationId?: SortOrder
    sender?: DriverOrderByWithRelationInput
    conversation?: ChatConversationOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    content?: StringFilter<"ChatMessage"> | string
    mediaUrl?: StringNullableFilter<"ChatMessage"> | string | null
    mediaType?: StringNullableFilter<"ChatMessage"> | string | null
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    read?: BoolFilter<"ChatMessage"> | boolean
    senderId?: StringFilter<"ChatMessage"> | string
    conversationId?: StringFilter<"ChatMessage"> | string
    sender?: XOR<DriverScalarRelationFilter, DriverWhereInput>
    conversation?: XOR<ChatConversationScalarRelationFilter, ChatConversationWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrderInput | SortOrder
    mediaType?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    read?: SortOrder
    senderId?: SortOrder
    conversationId?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    mediaUrl?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    mediaType?: StringNullableWithAggregatesFilter<"ChatMessage"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
    read?: BoolWithAggregatesFilter<"ChatMessage"> | boolean
    senderId?: StringWithAggregatesFilter<"ChatMessage"> | string
    conversationId?: StringWithAggregatesFilter<"ChatMessage"> | string
  }

  export type AdminCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminCreateManyInput = {
    id?: string
    name: string
    email: string
    passwordHash: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriverCreateInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type DriverCreateManyInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
  }

  export type DriverUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type DriverUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
  }

  export type VehicleCreateInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriver?: DriverCreateNestedOneWithoutAssignedVehicleInput
    reports?: DriverReportCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriverId?: string | null
    reports?: DriverReportUncheckedCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriver?: DriverUpdateOneWithoutAssignedVehicleNestedInput
    reports?: DriverReportUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    reports?: DriverReportUncheckedUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleCreateManyInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriverId?: string | null
  }

  export type VehicleUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type VehicleUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ApplicationCreateInput = {
    id?: string
    fullName: string
    phone: string
    email?: string | null
    reason: string
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedDriver?: DriverCreateNestedOneWithoutApplicationRefInput
  }

  export type ApplicationUncheckedCreateInput = {
    id?: string
    fullName: string
    phone: string
    email?: string | null
    reason: string
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedDriverId?: string | null
  }

  export type ApplicationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDriver?: DriverUpdateOneWithoutApplicationRefNestedInput
  }

  export type ApplicationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ApplicationCreateManyInput = {
    id?: string
    fullName: string
    phone: string
    email?: string | null
    reason: string
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    approvedDriverId?: string | null
  }

  export type ApplicationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    approvedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DriverReportCreateInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutReportsInput
    vehicle?: VehicleCreateNestedOneWithoutReportsInput
  }

  export type DriverReportUncheckedCreateInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
    vehicleId?: string | null
  }

  export type DriverReportUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutReportsNestedInput
    vehicle?: VehicleUpdateOneWithoutReportsNestedInput
  }

  export type DriverReportUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    vehicleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DriverReportCreateManyInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
    vehicleId?: string | null
  }

  export type DriverReportUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DriverReportUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    vehicleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartsExchangeCreateInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutPartsExchangesInput
    vehicle: VehicleCreateNestedOneWithoutPartsExchangesInput
  }

  export type PartsExchangeUncheckedCreateInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
    vehicleId: string
  }

  export type PartsExchangeUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutPartsExchangesNestedInput
    vehicle?: VehicleUpdateOneRequiredWithoutPartsExchangesNestedInput
  }

  export type PartsExchangeUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
  }

  export type PartsExchangeCreateManyInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
    vehicleId: string
  }

  export type PartsExchangeUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PartsExchangeUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
    vehicleId?: StringFieldUpdateOperationsInput | string
  }

  export type SalesRecordCreateInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutSalesRecordsInput
  }

  export type SalesRecordUncheckedCreateInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type SalesRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutSalesRecordsNestedInput
  }

  export type SalesRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type SalesRecordCreateManyInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type SalesRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type LedgerEntryCreateInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
    driver: DriverCreateNestedOneWithoutLedgerEntriesInput
  }

  export type LedgerEntryUncheckedCreateInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
    driverId: string
  }

  export type LedgerEntryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutLedgerEntriesNestedInput
  }

  export type LedgerEntryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type LedgerEntryCreateManyInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
    driverId: string
  }

  export type LedgerEntryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type LocationPingCreateInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    gpsDeviceId?: string | null
    vehicle: VehicleCreateNestedOneWithoutLocationPingsInput
  }

  export type LocationPingUncheckedCreateInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    vehicleId: string
    gpsDeviceId?: string | null
  }

  export type LocationPingUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    vehicle?: VehicleUpdateOneRequiredWithoutLocationPingsNestedInput
  }

  export type LocationPingUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationPingCreateManyInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    vehicleId: string
    gpsDeviceId?: string | null
  }

  export type LocationPingUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationPingUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatConversationCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1: DriverCreateNestedOneWithoutConversations1Input
    driver2: DriverCreateNestedOneWithoutConversations2Input
    messages?: ChatMessageCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUncheckedCreateInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1Id: string
    driver2Id: string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1?: DriverUpdateOneRequiredWithoutConversations1NestedInput
    driver2?: DriverUpdateOneRequiredWithoutConversations2NestedInput
    messages?: ChatMessageUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1Id?: StringFieldUpdateOperationsInput | string
    driver2Id?: StringFieldUpdateOperationsInput | string
    messages?: ChatMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationCreateManyInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1Id: string
    driver2Id: string
  }

  export type ChatConversationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatConversationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1Id?: StringFieldUpdateOperationsInput | string
    driver2Id?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    sender: DriverCreateNestedOneWithoutSentMessagesInput
    conversation: ChatConversationCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    senderId: string
    conversationId: string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    sender?: DriverUpdateOneRequiredWithoutSentMessagesNestedInput
    conversation?: ChatConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    senderId: string
    conversationId: string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderId?: StringFieldUpdateOperationsInput | string
    conversationId?: StringFieldUpdateOperationsInput | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type AdminCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AdminMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    passwordHash?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type VehicleNullableScalarRelationFilter = {
    is?: VehicleWhereInput | null
    isNot?: VehicleWhereInput | null
  }

  export type DriverReportListRelationFilter = {
    every?: DriverReportWhereInput
    some?: DriverReportWhereInput
    none?: DriverReportWhereInput
  }

  export type PartsExchangeListRelationFilter = {
    every?: PartsExchangeWhereInput
    some?: PartsExchangeWhereInput
    none?: PartsExchangeWhereInput
  }

  export type SalesRecordListRelationFilter = {
    every?: SalesRecordWhereInput
    some?: SalesRecordWhereInput
    none?: SalesRecordWhereInput
  }

  export type LedgerEntryListRelationFilter = {
    every?: LedgerEntryWhereInput
    some?: LedgerEntryWhereInput
    none?: LedgerEntryWhereInput
  }

  export type ApplicationNullableScalarRelationFilter = {
    is?: ApplicationWhereInput | null
    isNot?: ApplicationWhereInput | null
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type ChatConversationListRelationFilter = {
    every?: ChatConversationWhereInput
    some?: ChatConversationWhereInput
    none?: ChatConversationWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type DriverReportOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PartsExchangeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SalesRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LedgerEntryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatConversationOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DriverCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordHash?: SortOrder
  }

  export type DriverAvgOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type DriverMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordHash?: SortOrder
  }

  export type DriverMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    balance?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    passwordHash?: SortOrder
  }

  export type DriverSumOrderByAggregateInput = {
    balance?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DriverNullableScalarRelationFilter = {
    is?: DriverWhereInput | null
    isNot?: DriverWhereInput | null
  }

  export type LocationPingListRelationFilter = {
    every?: LocationPingWhereInput
    some?: LocationPingWhereInput
    none?: LocationPingWhereInput
  }

  export type LocationPingOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type VehicleCountOrderByAggregateInput = {
    id?: SortOrder
    plateNumber?: SortOrder
    make?: SortOrder
    model?: SortOrder
    year?: SortOrder
    severityStatus?: SortOrder
    gpsDeviceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignedDriverId?: SortOrder
  }

  export type VehicleAvgOrderByAggregateInput = {
    year?: SortOrder
  }

  export type VehicleMaxOrderByAggregateInput = {
    id?: SortOrder
    plateNumber?: SortOrder
    make?: SortOrder
    model?: SortOrder
    year?: SortOrder
    severityStatus?: SortOrder
    gpsDeviceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignedDriverId?: SortOrder
  }

  export type VehicleMinOrderByAggregateInput = {
    id?: SortOrder
    plateNumber?: SortOrder
    make?: SortOrder
    model?: SortOrder
    year?: SortOrder
    severityStatus?: SortOrder
    gpsDeviceId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    assignedDriverId?: SortOrder
  }

  export type VehicleSumOrderByAggregateInput = {
    year?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type ApplicationCountOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    reason?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedDriverId?: SortOrder
  }

  export type ApplicationMaxOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    reason?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedDriverId?: SortOrder
  }

  export type ApplicationMinOrderByAggregateInput = {
    id?: SortOrder
    fullName?: SortOrder
    phone?: SortOrder
    email?: SortOrder
    reason?: SortOrder
    licenseDocUrl?: SortOrder
    ghanaCardUrl?: SortOrder
    irisScanUrl?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    approvedDriverId?: SortOrder
  }

  export type DriverScalarRelationFilter = {
    is?: DriverWhereInput
    isNot?: DriverWhereInput
  }

  export type DriverReportCountOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    description?: SortOrder
    photoUrl?: SortOrder
    suggestedSeverity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type DriverReportMaxOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    description?: SortOrder
    photoUrl?: SortOrder
    suggestedSeverity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type DriverReportMinOrderByAggregateInput = {
    id?: SortOrder
    type?: SortOrder
    description?: SortOrder
    photoUrl?: SortOrder
    suggestedSeverity?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type VehicleScalarRelationFilter = {
    is?: VehicleWhereInput
    isNot?: VehicleWhereInput
  }

  export type PartsExchangeCountOrderByAggregateInput = {
    id?: SortOrder
    partName?: SortOrder
    cost?: SortOrder
    date?: SortOrder
    photoUrl?: SortOrder
    receiptUrl?: SortOrder
    reimbursementStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type PartsExchangeAvgOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type PartsExchangeMaxOrderByAggregateInput = {
    id?: SortOrder
    partName?: SortOrder
    cost?: SortOrder
    date?: SortOrder
    photoUrl?: SortOrder
    receiptUrl?: SortOrder
    reimbursementStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type PartsExchangeMinOrderByAggregateInput = {
    id?: SortOrder
    partName?: SortOrder
    cost?: SortOrder
    date?: SortOrder
    photoUrl?: SortOrder
    receiptUrl?: SortOrder
    reimbursementStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
    vehicleId?: SortOrder
  }

  export type PartsExchangeSumOrderByAggregateInput = {
    cost?: SortOrder
  }

  export type SalesRecordCountOrderByAggregateInput = {
    id?: SortOrder
    weekLabel?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    momoReference?: SortOrder
    confirmationStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
  }

  export type SalesRecordAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type SalesRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    weekLabel?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    momoReference?: SortOrder
    confirmationStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
  }

  export type SalesRecordMinOrderByAggregateInput = {
    id?: SortOrder
    weekLabel?: SortOrder
    amount?: SortOrder
    paymentMethod?: SortOrder
    momoReference?: SortOrder
    confirmationStatus?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driverId?: SortOrder
  }

  export type SalesRecordSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LedgerEntryCountOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    direction?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    driverId?: SortOrder
  }

  export type LedgerEntryAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LedgerEntryMaxOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    direction?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    driverId?: SortOrder
  }

  export type LedgerEntryMinOrderByAggregateInput = {
    id?: SortOrder
    amount?: SortOrder
    direction?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    driverId?: SortOrder
  }

  export type LedgerEntrySumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type LocationPingCountOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    timestamp?: SortOrder
    vehicleId?: SortOrder
    gpsDeviceId?: SortOrder
  }

  export type LocationPingAvgOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type LocationPingMaxOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    timestamp?: SortOrder
    vehicleId?: SortOrder
    gpsDeviceId?: SortOrder
  }

  export type LocationPingMinOrderByAggregateInput = {
    id?: SortOrder
    lat?: SortOrder
    lng?: SortOrder
    timestamp?: SortOrder
    vehicleId?: SortOrder
    gpsDeviceId?: SortOrder
  }

  export type LocationPingSumOrderByAggregateInput = {
    lat?: SortOrder
    lng?: SortOrder
  }

  export type ChatConversationDriver1IdDriver2IdCompoundUniqueInput = {
    driver1Id: string
    driver2Id: string
  }

  export type ChatConversationCountOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driver1Id?: SortOrder
    driver2Id?: SortOrder
  }

  export type ChatConversationMaxOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driver1Id?: SortOrder
    driver2Id?: SortOrder
  }

  export type ChatConversationMinOrderByAggregateInput = {
    id?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    driver1Id?: SortOrder
    driver2Id?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ChatConversationScalarRelationFilter = {
    is?: ChatConversationWhereInput
    isNot?: ChatConversationWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    createdAt?: SortOrder
    read?: SortOrder
    senderId?: SortOrder
    conversationId?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    createdAt?: SortOrder
    read?: SortOrder
    senderId?: SortOrder
    conversationId?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    content?: SortOrder
    mediaUrl?: SortOrder
    mediaType?: SortOrder
    createdAt?: SortOrder
    read?: SortOrder
    senderId?: SortOrder
    conversationId?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type VehicleCreateNestedOneWithoutAssignedDriverInput = {
    create?: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutAssignedDriverInput
    connect?: VehicleWhereUniqueInput
  }

  export type DriverReportCreateNestedManyWithoutDriverInput = {
    create?: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput> | DriverReportCreateWithoutDriverInput[] | DriverReportUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutDriverInput | DriverReportCreateOrConnectWithoutDriverInput[]
    createMany?: DriverReportCreateManyDriverInputEnvelope
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
  }

  export type PartsExchangeCreateNestedManyWithoutDriverInput = {
    create?: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput> | PartsExchangeCreateWithoutDriverInput[] | PartsExchangeUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutDriverInput | PartsExchangeCreateOrConnectWithoutDriverInput[]
    createMany?: PartsExchangeCreateManyDriverInputEnvelope
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
  }

  export type SalesRecordCreateNestedManyWithoutDriverInput = {
    create?: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput> | SalesRecordCreateWithoutDriverInput[] | SalesRecordUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SalesRecordCreateOrConnectWithoutDriverInput | SalesRecordCreateOrConnectWithoutDriverInput[]
    createMany?: SalesRecordCreateManyDriverInputEnvelope
    connect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
  }

  export type LedgerEntryCreateNestedManyWithoutDriverInput = {
    create?: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput> | LedgerEntryCreateWithoutDriverInput[] | LedgerEntryUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutDriverInput | LedgerEntryCreateOrConnectWithoutDriverInput[]
    createMany?: LedgerEntryCreateManyDriverInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type ApplicationCreateNestedOneWithoutApprovedDriverInput = {
    create?: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApprovedDriverInput
    connect?: ApplicationWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutSenderInput = {
    create?: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput> | ChatMessageCreateWithoutSenderInput[] | ChatMessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSenderInput | ChatMessageCreateOrConnectWithoutSenderInput[]
    createMany?: ChatMessageCreateManySenderInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatConversationCreateNestedManyWithoutDriver1Input = {
    create?: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input> | ChatConversationCreateWithoutDriver1Input[] | ChatConversationUncheckedCreateWithoutDriver1Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver1Input | ChatConversationCreateOrConnectWithoutDriver1Input[]
    createMany?: ChatConversationCreateManyDriver1InputEnvelope
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
  }

  export type ChatConversationCreateNestedManyWithoutDriver2Input = {
    create?: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input> | ChatConversationCreateWithoutDriver2Input[] | ChatConversationUncheckedCreateWithoutDriver2Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver2Input | ChatConversationCreateOrConnectWithoutDriver2Input[]
    createMany?: ChatConversationCreateManyDriver2InputEnvelope
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
  }

  export type VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput = {
    create?: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutAssignedDriverInput
    connect?: VehicleWhereUniqueInput
  }

  export type DriverReportUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput> | DriverReportCreateWithoutDriverInput[] | DriverReportUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutDriverInput | DriverReportCreateOrConnectWithoutDriverInput[]
    createMany?: DriverReportCreateManyDriverInputEnvelope
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
  }

  export type PartsExchangeUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput> | PartsExchangeCreateWithoutDriverInput[] | PartsExchangeUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutDriverInput | PartsExchangeCreateOrConnectWithoutDriverInput[]
    createMany?: PartsExchangeCreateManyDriverInputEnvelope
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
  }

  export type SalesRecordUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput> | SalesRecordCreateWithoutDriverInput[] | SalesRecordUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SalesRecordCreateOrConnectWithoutDriverInput | SalesRecordCreateOrConnectWithoutDriverInput[]
    createMany?: SalesRecordCreateManyDriverInputEnvelope
    connect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
  }

  export type LedgerEntryUncheckedCreateNestedManyWithoutDriverInput = {
    create?: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput> | LedgerEntryCreateWithoutDriverInput[] | LedgerEntryUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutDriverInput | LedgerEntryCreateOrConnectWithoutDriverInput[]
    createMany?: LedgerEntryCreateManyDriverInputEnvelope
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
  }

  export type ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput = {
    create?: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApprovedDriverInput
    connect?: ApplicationWhereUniqueInput
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutSenderInput = {
    create?: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput> | ChatMessageCreateWithoutSenderInput[] | ChatMessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSenderInput | ChatMessageCreateOrConnectWithoutSenderInput[]
    createMany?: ChatMessageCreateManySenderInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatConversationUncheckedCreateNestedManyWithoutDriver1Input = {
    create?: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input> | ChatConversationCreateWithoutDriver1Input[] | ChatConversationUncheckedCreateWithoutDriver1Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver1Input | ChatConversationCreateOrConnectWithoutDriver1Input[]
    createMany?: ChatConversationCreateManyDriver1InputEnvelope
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
  }

  export type ChatConversationUncheckedCreateNestedManyWithoutDriver2Input = {
    create?: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input> | ChatConversationCreateWithoutDriver2Input[] | ChatConversationUncheckedCreateWithoutDriver2Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver2Input | ChatConversationCreateOrConnectWithoutDriver2Input[]
    createMany?: ChatConversationCreateManyDriver2InputEnvelope
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type VehicleUpdateOneWithoutAssignedDriverNestedInput = {
    create?: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutAssignedDriverInput
    upsert?: VehicleUpsertWithoutAssignedDriverInput
    disconnect?: VehicleWhereInput | boolean
    delete?: VehicleWhereInput | boolean
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutAssignedDriverInput, VehicleUpdateWithoutAssignedDriverInput>, VehicleUncheckedUpdateWithoutAssignedDriverInput>
  }

  export type DriverReportUpdateManyWithoutDriverNestedInput = {
    create?: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput> | DriverReportCreateWithoutDriverInput[] | DriverReportUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutDriverInput | DriverReportCreateOrConnectWithoutDriverInput[]
    upsert?: DriverReportUpsertWithWhereUniqueWithoutDriverInput | DriverReportUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: DriverReportCreateManyDriverInputEnvelope
    set?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    disconnect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    delete?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    update?: DriverReportUpdateWithWhereUniqueWithoutDriverInput | DriverReportUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: DriverReportUpdateManyWithWhereWithoutDriverInput | DriverReportUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
  }

  export type PartsExchangeUpdateManyWithoutDriverNestedInput = {
    create?: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput> | PartsExchangeCreateWithoutDriverInput[] | PartsExchangeUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutDriverInput | PartsExchangeCreateOrConnectWithoutDriverInput[]
    upsert?: PartsExchangeUpsertWithWhereUniqueWithoutDriverInput | PartsExchangeUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: PartsExchangeCreateManyDriverInputEnvelope
    set?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    disconnect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    delete?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    update?: PartsExchangeUpdateWithWhereUniqueWithoutDriverInput | PartsExchangeUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: PartsExchangeUpdateManyWithWhereWithoutDriverInput | PartsExchangeUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
  }

  export type SalesRecordUpdateManyWithoutDriverNestedInput = {
    create?: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput> | SalesRecordCreateWithoutDriverInput[] | SalesRecordUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SalesRecordCreateOrConnectWithoutDriverInput | SalesRecordCreateOrConnectWithoutDriverInput[]
    upsert?: SalesRecordUpsertWithWhereUniqueWithoutDriverInput | SalesRecordUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: SalesRecordCreateManyDriverInputEnvelope
    set?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    disconnect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    delete?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    connect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    update?: SalesRecordUpdateWithWhereUniqueWithoutDriverInput | SalesRecordUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: SalesRecordUpdateManyWithWhereWithoutDriverInput | SalesRecordUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: SalesRecordScalarWhereInput | SalesRecordScalarWhereInput[]
  }

  export type LedgerEntryUpdateManyWithoutDriverNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput> | LedgerEntryCreateWithoutDriverInput[] | LedgerEntryUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutDriverInput | LedgerEntryCreateOrConnectWithoutDriverInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutDriverInput | LedgerEntryUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: LedgerEntryCreateManyDriverInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutDriverInput | LedgerEntryUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutDriverInput | LedgerEntryUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type ApplicationUpdateOneWithoutApprovedDriverNestedInput = {
    create?: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApprovedDriverInput
    upsert?: ApplicationUpsertWithoutApprovedDriverInput
    disconnect?: ApplicationWhereInput | boolean
    delete?: ApplicationWhereInput | boolean
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutApprovedDriverInput, ApplicationUpdateWithoutApprovedDriverInput>, ApplicationUncheckedUpdateWithoutApprovedDriverInput>
  }

  export type ChatMessageUpdateManyWithoutSenderNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput> | ChatMessageCreateWithoutSenderInput[] | ChatMessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSenderInput | ChatMessageCreateOrConnectWithoutSenderInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSenderInput | ChatMessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: ChatMessageCreateManySenderInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSenderInput | ChatMessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSenderInput | ChatMessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatConversationUpdateManyWithoutDriver1NestedInput = {
    create?: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input> | ChatConversationCreateWithoutDriver1Input[] | ChatConversationUncheckedCreateWithoutDriver1Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver1Input | ChatConversationCreateOrConnectWithoutDriver1Input[]
    upsert?: ChatConversationUpsertWithWhereUniqueWithoutDriver1Input | ChatConversationUpsertWithWhereUniqueWithoutDriver1Input[]
    createMany?: ChatConversationCreateManyDriver1InputEnvelope
    set?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    disconnect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    delete?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    update?: ChatConversationUpdateWithWhereUniqueWithoutDriver1Input | ChatConversationUpdateWithWhereUniqueWithoutDriver1Input[]
    updateMany?: ChatConversationUpdateManyWithWhereWithoutDriver1Input | ChatConversationUpdateManyWithWhereWithoutDriver1Input[]
    deleteMany?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
  }

  export type ChatConversationUpdateManyWithoutDriver2NestedInput = {
    create?: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input> | ChatConversationCreateWithoutDriver2Input[] | ChatConversationUncheckedCreateWithoutDriver2Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver2Input | ChatConversationCreateOrConnectWithoutDriver2Input[]
    upsert?: ChatConversationUpsertWithWhereUniqueWithoutDriver2Input | ChatConversationUpsertWithWhereUniqueWithoutDriver2Input[]
    createMany?: ChatConversationCreateManyDriver2InputEnvelope
    set?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    disconnect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    delete?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    update?: ChatConversationUpdateWithWhereUniqueWithoutDriver2Input | ChatConversationUpdateWithWhereUniqueWithoutDriver2Input[]
    updateMany?: ChatConversationUpdateManyWithWhereWithoutDriver2Input | ChatConversationUpdateManyWithWhereWithoutDriver2Input[]
    deleteMany?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
  }

  export type VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput = {
    create?: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutAssignedDriverInput
    upsert?: VehicleUpsertWithoutAssignedDriverInput
    disconnect?: VehicleWhereInput | boolean
    delete?: VehicleWhereInput | boolean
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutAssignedDriverInput, VehicleUpdateWithoutAssignedDriverInput>, VehicleUncheckedUpdateWithoutAssignedDriverInput>
  }

  export type DriverReportUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput> | DriverReportCreateWithoutDriverInput[] | DriverReportUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutDriverInput | DriverReportCreateOrConnectWithoutDriverInput[]
    upsert?: DriverReportUpsertWithWhereUniqueWithoutDriverInput | DriverReportUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: DriverReportCreateManyDriverInputEnvelope
    set?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    disconnect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    delete?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    update?: DriverReportUpdateWithWhereUniqueWithoutDriverInput | DriverReportUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: DriverReportUpdateManyWithWhereWithoutDriverInput | DriverReportUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
  }

  export type PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput> | PartsExchangeCreateWithoutDriverInput[] | PartsExchangeUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutDriverInput | PartsExchangeCreateOrConnectWithoutDriverInput[]
    upsert?: PartsExchangeUpsertWithWhereUniqueWithoutDriverInput | PartsExchangeUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: PartsExchangeCreateManyDriverInputEnvelope
    set?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    disconnect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    delete?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    update?: PartsExchangeUpdateWithWhereUniqueWithoutDriverInput | PartsExchangeUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: PartsExchangeUpdateManyWithWhereWithoutDriverInput | PartsExchangeUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
  }

  export type SalesRecordUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput> | SalesRecordCreateWithoutDriverInput[] | SalesRecordUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: SalesRecordCreateOrConnectWithoutDriverInput | SalesRecordCreateOrConnectWithoutDriverInput[]
    upsert?: SalesRecordUpsertWithWhereUniqueWithoutDriverInput | SalesRecordUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: SalesRecordCreateManyDriverInputEnvelope
    set?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    disconnect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    delete?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    connect?: SalesRecordWhereUniqueInput | SalesRecordWhereUniqueInput[]
    update?: SalesRecordUpdateWithWhereUniqueWithoutDriverInput | SalesRecordUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: SalesRecordUpdateManyWithWhereWithoutDriverInput | SalesRecordUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: SalesRecordScalarWhereInput | SalesRecordScalarWhereInput[]
  }

  export type LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput = {
    create?: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput> | LedgerEntryCreateWithoutDriverInput[] | LedgerEntryUncheckedCreateWithoutDriverInput[]
    connectOrCreate?: LedgerEntryCreateOrConnectWithoutDriverInput | LedgerEntryCreateOrConnectWithoutDriverInput[]
    upsert?: LedgerEntryUpsertWithWhereUniqueWithoutDriverInput | LedgerEntryUpsertWithWhereUniqueWithoutDriverInput[]
    createMany?: LedgerEntryCreateManyDriverInputEnvelope
    set?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    disconnect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    delete?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    connect?: LedgerEntryWhereUniqueInput | LedgerEntryWhereUniqueInput[]
    update?: LedgerEntryUpdateWithWhereUniqueWithoutDriverInput | LedgerEntryUpdateWithWhereUniqueWithoutDriverInput[]
    updateMany?: LedgerEntryUpdateManyWithWhereWithoutDriverInput | LedgerEntryUpdateManyWithWhereWithoutDriverInput[]
    deleteMany?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
  }

  export type ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput = {
    create?: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
    connectOrCreate?: ApplicationCreateOrConnectWithoutApprovedDriverInput
    upsert?: ApplicationUpsertWithoutApprovedDriverInput
    disconnect?: ApplicationWhereInput | boolean
    delete?: ApplicationWhereInput | boolean
    connect?: ApplicationWhereUniqueInput
    update?: XOR<XOR<ApplicationUpdateToOneWithWhereWithoutApprovedDriverInput, ApplicationUpdateWithoutApprovedDriverInput>, ApplicationUncheckedUpdateWithoutApprovedDriverInput>
  }

  export type ChatMessageUncheckedUpdateManyWithoutSenderNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput> | ChatMessageCreateWithoutSenderInput[] | ChatMessageUncheckedCreateWithoutSenderInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSenderInput | ChatMessageCreateOrConnectWithoutSenderInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSenderInput | ChatMessageUpsertWithWhereUniqueWithoutSenderInput[]
    createMany?: ChatMessageCreateManySenderInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSenderInput | ChatMessageUpdateWithWhereUniqueWithoutSenderInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSenderInput | ChatMessageUpdateManyWithWhereWithoutSenderInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput = {
    create?: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input> | ChatConversationCreateWithoutDriver1Input[] | ChatConversationUncheckedCreateWithoutDriver1Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver1Input | ChatConversationCreateOrConnectWithoutDriver1Input[]
    upsert?: ChatConversationUpsertWithWhereUniqueWithoutDriver1Input | ChatConversationUpsertWithWhereUniqueWithoutDriver1Input[]
    createMany?: ChatConversationCreateManyDriver1InputEnvelope
    set?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    disconnect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    delete?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    update?: ChatConversationUpdateWithWhereUniqueWithoutDriver1Input | ChatConversationUpdateWithWhereUniqueWithoutDriver1Input[]
    updateMany?: ChatConversationUpdateManyWithWhereWithoutDriver1Input | ChatConversationUpdateManyWithWhereWithoutDriver1Input[]
    deleteMany?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
  }

  export type ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput = {
    create?: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input> | ChatConversationCreateWithoutDriver2Input[] | ChatConversationUncheckedCreateWithoutDriver2Input[]
    connectOrCreate?: ChatConversationCreateOrConnectWithoutDriver2Input | ChatConversationCreateOrConnectWithoutDriver2Input[]
    upsert?: ChatConversationUpsertWithWhereUniqueWithoutDriver2Input | ChatConversationUpsertWithWhereUniqueWithoutDriver2Input[]
    createMany?: ChatConversationCreateManyDriver2InputEnvelope
    set?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    disconnect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    delete?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    connect?: ChatConversationWhereUniqueInput | ChatConversationWhereUniqueInput[]
    update?: ChatConversationUpdateWithWhereUniqueWithoutDriver2Input | ChatConversationUpdateWithWhereUniqueWithoutDriver2Input[]
    updateMany?: ChatConversationUpdateManyWithWhereWithoutDriver2Input | ChatConversationUpdateManyWithWhereWithoutDriver2Input[]
    deleteMany?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
  }

  export type DriverCreateNestedOneWithoutAssignedVehicleInput = {
    create?: XOR<DriverCreateWithoutAssignedVehicleInput, DriverUncheckedCreateWithoutAssignedVehicleInput>
    connectOrCreate?: DriverCreateOrConnectWithoutAssignedVehicleInput
    connect?: DriverWhereUniqueInput
  }

  export type DriverReportCreateNestedManyWithoutVehicleInput = {
    create?: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput> | DriverReportCreateWithoutVehicleInput[] | DriverReportUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutVehicleInput | DriverReportCreateOrConnectWithoutVehicleInput[]
    createMany?: DriverReportCreateManyVehicleInputEnvelope
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
  }

  export type PartsExchangeCreateNestedManyWithoutVehicleInput = {
    create?: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput> | PartsExchangeCreateWithoutVehicleInput[] | PartsExchangeUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutVehicleInput | PartsExchangeCreateOrConnectWithoutVehicleInput[]
    createMany?: PartsExchangeCreateManyVehicleInputEnvelope
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
  }

  export type LocationPingCreateNestedManyWithoutVehicleInput = {
    create?: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput> | LocationPingCreateWithoutVehicleInput[] | LocationPingUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationPingCreateOrConnectWithoutVehicleInput | LocationPingCreateOrConnectWithoutVehicleInput[]
    createMany?: LocationPingCreateManyVehicleInputEnvelope
    connect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
  }

  export type DriverReportUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput> | DriverReportCreateWithoutVehicleInput[] | DriverReportUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutVehicleInput | DriverReportCreateOrConnectWithoutVehicleInput[]
    createMany?: DriverReportCreateManyVehicleInputEnvelope
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
  }

  export type PartsExchangeUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput> | PartsExchangeCreateWithoutVehicleInput[] | PartsExchangeUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutVehicleInput | PartsExchangeCreateOrConnectWithoutVehicleInput[]
    createMany?: PartsExchangeCreateManyVehicleInputEnvelope
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
  }

  export type LocationPingUncheckedCreateNestedManyWithoutVehicleInput = {
    create?: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput> | LocationPingCreateWithoutVehicleInput[] | LocationPingUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationPingCreateOrConnectWithoutVehicleInput | LocationPingCreateOrConnectWithoutVehicleInput[]
    createMany?: LocationPingCreateManyVehicleInputEnvelope
    connect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DriverUpdateOneWithoutAssignedVehicleNestedInput = {
    create?: XOR<DriverCreateWithoutAssignedVehicleInput, DriverUncheckedCreateWithoutAssignedVehicleInput>
    connectOrCreate?: DriverCreateOrConnectWithoutAssignedVehicleInput
    upsert?: DriverUpsertWithoutAssignedVehicleInput
    disconnect?: DriverWhereInput | boolean
    delete?: DriverWhereInput | boolean
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutAssignedVehicleInput, DriverUpdateWithoutAssignedVehicleInput>, DriverUncheckedUpdateWithoutAssignedVehicleInput>
  }

  export type DriverReportUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput> | DriverReportCreateWithoutVehicleInput[] | DriverReportUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutVehicleInput | DriverReportCreateOrConnectWithoutVehicleInput[]
    upsert?: DriverReportUpsertWithWhereUniqueWithoutVehicleInput | DriverReportUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: DriverReportCreateManyVehicleInputEnvelope
    set?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    disconnect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    delete?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    update?: DriverReportUpdateWithWhereUniqueWithoutVehicleInput | DriverReportUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: DriverReportUpdateManyWithWhereWithoutVehicleInput | DriverReportUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
  }

  export type PartsExchangeUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput> | PartsExchangeCreateWithoutVehicleInput[] | PartsExchangeUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutVehicleInput | PartsExchangeCreateOrConnectWithoutVehicleInput[]
    upsert?: PartsExchangeUpsertWithWhereUniqueWithoutVehicleInput | PartsExchangeUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: PartsExchangeCreateManyVehicleInputEnvelope
    set?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    disconnect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    delete?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    update?: PartsExchangeUpdateWithWhereUniqueWithoutVehicleInput | PartsExchangeUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: PartsExchangeUpdateManyWithWhereWithoutVehicleInput | PartsExchangeUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
  }

  export type LocationPingUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput> | LocationPingCreateWithoutVehicleInput[] | LocationPingUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationPingCreateOrConnectWithoutVehicleInput | LocationPingCreateOrConnectWithoutVehicleInput[]
    upsert?: LocationPingUpsertWithWhereUniqueWithoutVehicleInput | LocationPingUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: LocationPingCreateManyVehicleInputEnvelope
    set?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    disconnect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    delete?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    connect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    update?: LocationPingUpdateWithWhereUniqueWithoutVehicleInput | LocationPingUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: LocationPingUpdateManyWithWhereWithoutVehicleInput | LocationPingUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: LocationPingScalarWhereInput | LocationPingScalarWhereInput[]
  }

  export type DriverReportUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput> | DriverReportCreateWithoutVehicleInput[] | DriverReportUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: DriverReportCreateOrConnectWithoutVehicleInput | DriverReportCreateOrConnectWithoutVehicleInput[]
    upsert?: DriverReportUpsertWithWhereUniqueWithoutVehicleInput | DriverReportUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: DriverReportCreateManyVehicleInputEnvelope
    set?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    disconnect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    delete?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    connect?: DriverReportWhereUniqueInput | DriverReportWhereUniqueInput[]
    update?: DriverReportUpdateWithWhereUniqueWithoutVehicleInput | DriverReportUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: DriverReportUpdateManyWithWhereWithoutVehicleInput | DriverReportUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
  }

  export type PartsExchangeUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput> | PartsExchangeCreateWithoutVehicleInput[] | PartsExchangeUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: PartsExchangeCreateOrConnectWithoutVehicleInput | PartsExchangeCreateOrConnectWithoutVehicleInput[]
    upsert?: PartsExchangeUpsertWithWhereUniqueWithoutVehicleInput | PartsExchangeUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: PartsExchangeCreateManyVehicleInputEnvelope
    set?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    disconnect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    delete?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    connect?: PartsExchangeWhereUniqueInput | PartsExchangeWhereUniqueInput[]
    update?: PartsExchangeUpdateWithWhereUniqueWithoutVehicleInput | PartsExchangeUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: PartsExchangeUpdateManyWithWhereWithoutVehicleInput | PartsExchangeUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
  }

  export type LocationPingUncheckedUpdateManyWithoutVehicleNestedInput = {
    create?: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput> | LocationPingCreateWithoutVehicleInput[] | LocationPingUncheckedCreateWithoutVehicleInput[]
    connectOrCreate?: LocationPingCreateOrConnectWithoutVehicleInput | LocationPingCreateOrConnectWithoutVehicleInput[]
    upsert?: LocationPingUpsertWithWhereUniqueWithoutVehicleInput | LocationPingUpsertWithWhereUniqueWithoutVehicleInput[]
    createMany?: LocationPingCreateManyVehicleInputEnvelope
    set?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    disconnect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    delete?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    connect?: LocationPingWhereUniqueInput | LocationPingWhereUniqueInput[]
    update?: LocationPingUpdateWithWhereUniqueWithoutVehicleInput | LocationPingUpdateWithWhereUniqueWithoutVehicleInput[]
    updateMany?: LocationPingUpdateManyWithWhereWithoutVehicleInput | LocationPingUpdateManyWithWhereWithoutVehicleInput[]
    deleteMany?: LocationPingScalarWhereInput | LocationPingScalarWhereInput[]
  }

  export type DriverCreateNestedOneWithoutApplicationRefInput = {
    create?: XOR<DriverCreateWithoutApplicationRefInput, DriverUncheckedCreateWithoutApplicationRefInput>
    connectOrCreate?: DriverCreateOrConnectWithoutApplicationRefInput
    connect?: DriverWhereUniqueInput
  }

  export type DriverUpdateOneWithoutApplicationRefNestedInput = {
    create?: XOR<DriverCreateWithoutApplicationRefInput, DriverUncheckedCreateWithoutApplicationRefInput>
    connectOrCreate?: DriverCreateOrConnectWithoutApplicationRefInput
    upsert?: DriverUpsertWithoutApplicationRefInput
    disconnect?: DriverWhereInput | boolean
    delete?: DriverWhereInput | boolean
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutApplicationRefInput, DriverUpdateWithoutApplicationRefInput>, DriverUncheckedUpdateWithoutApplicationRefInput>
  }

  export type DriverCreateNestedOneWithoutReportsInput = {
    create?: XOR<DriverCreateWithoutReportsInput, DriverUncheckedCreateWithoutReportsInput>
    connectOrCreate?: DriverCreateOrConnectWithoutReportsInput
    connect?: DriverWhereUniqueInput
  }

  export type VehicleCreateNestedOneWithoutReportsInput = {
    create?: XOR<VehicleCreateWithoutReportsInput, VehicleUncheckedCreateWithoutReportsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutReportsInput
    connect?: VehicleWhereUniqueInput
  }

  export type DriverUpdateOneRequiredWithoutReportsNestedInput = {
    create?: XOR<DriverCreateWithoutReportsInput, DriverUncheckedCreateWithoutReportsInput>
    connectOrCreate?: DriverCreateOrConnectWithoutReportsInput
    upsert?: DriverUpsertWithoutReportsInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutReportsInput, DriverUpdateWithoutReportsInput>, DriverUncheckedUpdateWithoutReportsInput>
  }

  export type VehicleUpdateOneWithoutReportsNestedInput = {
    create?: XOR<VehicleCreateWithoutReportsInput, VehicleUncheckedCreateWithoutReportsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutReportsInput
    upsert?: VehicleUpsertWithoutReportsInput
    disconnect?: VehicleWhereInput | boolean
    delete?: VehicleWhereInput | boolean
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutReportsInput, VehicleUpdateWithoutReportsInput>, VehicleUncheckedUpdateWithoutReportsInput>
  }

  export type DriverCreateNestedOneWithoutPartsExchangesInput = {
    create?: XOR<DriverCreateWithoutPartsExchangesInput, DriverUncheckedCreateWithoutPartsExchangesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutPartsExchangesInput
    connect?: DriverWhereUniqueInput
  }

  export type VehicleCreateNestedOneWithoutPartsExchangesInput = {
    create?: XOR<VehicleCreateWithoutPartsExchangesInput, VehicleUncheckedCreateWithoutPartsExchangesInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutPartsExchangesInput
    connect?: VehicleWhereUniqueInput
  }

  export type DriverUpdateOneRequiredWithoutPartsExchangesNestedInput = {
    create?: XOR<DriverCreateWithoutPartsExchangesInput, DriverUncheckedCreateWithoutPartsExchangesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutPartsExchangesInput
    upsert?: DriverUpsertWithoutPartsExchangesInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutPartsExchangesInput, DriverUpdateWithoutPartsExchangesInput>, DriverUncheckedUpdateWithoutPartsExchangesInput>
  }

  export type VehicleUpdateOneRequiredWithoutPartsExchangesNestedInput = {
    create?: XOR<VehicleCreateWithoutPartsExchangesInput, VehicleUncheckedCreateWithoutPartsExchangesInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutPartsExchangesInput
    upsert?: VehicleUpsertWithoutPartsExchangesInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutPartsExchangesInput, VehicleUpdateWithoutPartsExchangesInput>, VehicleUncheckedUpdateWithoutPartsExchangesInput>
  }

  export type DriverCreateNestedOneWithoutSalesRecordsInput = {
    create?: XOR<DriverCreateWithoutSalesRecordsInput, DriverUncheckedCreateWithoutSalesRecordsInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSalesRecordsInput
    connect?: DriverWhereUniqueInput
  }

  export type DriverUpdateOneRequiredWithoutSalesRecordsNestedInput = {
    create?: XOR<DriverCreateWithoutSalesRecordsInput, DriverUncheckedCreateWithoutSalesRecordsInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSalesRecordsInput
    upsert?: DriverUpsertWithoutSalesRecordsInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutSalesRecordsInput, DriverUpdateWithoutSalesRecordsInput>, DriverUncheckedUpdateWithoutSalesRecordsInput>
  }

  export type DriverCreateNestedOneWithoutLedgerEntriesInput = {
    create?: XOR<DriverCreateWithoutLedgerEntriesInput, DriverUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutLedgerEntriesInput
    connect?: DriverWhereUniqueInput
  }

  export type DriverUpdateOneRequiredWithoutLedgerEntriesNestedInput = {
    create?: XOR<DriverCreateWithoutLedgerEntriesInput, DriverUncheckedCreateWithoutLedgerEntriesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutLedgerEntriesInput
    upsert?: DriverUpsertWithoutLedgerEntriesInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutLedgerEntriesInput, DriverUpdateWithoutLedgerEntriesInput>, DriverUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type VehicleCreateNestedOneWithoutLocationPingsInput = {
    create?: XOR<VehicleCreateWithoutLocationPingsInput, VehicleUncheckedCreateWithoutLocationPingsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutLocationPingsInput
    connect?: VehicleWhereUniqueInput
  }

  export type VehicleUpdateOneRequiredWithoutLocationPingsNestedInput = {
    create?: XOR<VehicleCreateWithoutLocationPingsInput, VehicleUncheckedCreateWithoutLocationPingsInput>
    connectOrCreate?: VehicleCreateOrConnectWithoutLocationPingsInput
    upsert?: VehicleUpsertWithoutLocationPingsInput
    connect?: VehicleWhereUniqueInput
    update?: XOR<XOR<VehicleUpdateToOneWithWhereWithoutLocationPingsInput, VehicleUpdateWithoutLocationPingsInput>, VehicleUncheckedUpdateWithoutLocationPingsInput>
  }

  export type DriverCreateNestedOneWithoutConversations1Input = {
    create?: XOR<DriverCreateWithoutConversations1Input, DriverUncheckedCreateWithoutConversations1Input>
    connectOrCreate?: DriverCreateOrConnectWithoutConversations1Input
    connect?: DriverWhereUniqueInput
  }

  export type DriverCreateNestedOneWithoutConversations2Input = {
    create?: XOR<DriverCreateWithoutConversations2Input, DriverUncheckedCreateWithoutConversations2Input>
    connectOrCreate?: DriverCreateOrConnectWithoutConversations2Input
    connect?: DriverWhereUniqueInput
  }

  export type ChatMessageCreateNestedManyWithoutConversationInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutConversationInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type DriverUpdateOneRequiredWithoutConversations1NestedInput = {
    create?: XOR<DriverCreateWithoutConversations1Input, DriverUncheckedCreateWithoutConversations1Input>
    connectOrCreate?: DriverCreateOrConnectWithoutConversations1Input
    upsert?: DriverUpsertWithoutConversations1Input
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutConversations1Input, DriverUpdateWithoutConversations1Input>, DriverUncheckedUpdateWithoutConversations1Input>
  }

  export type DriverUpdateOneRequiredWithoutConversations2NestedInput = {
    create?: XOR<DriverCreateWithoutConversations2Input, DriverUncheckedCreateWithoutConversations2Input>
    connectOrCreate?: DriverCreateOrConnectWithoutConversations2Input
    upsert?: DriverUpsertWithoutConversations2Input
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutConversations2Input, DriverUpdateWithoutConversations2Input>, DriverUncheckedUpdateWithoutConversations2Input>
  }

  export type ChatMessageUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutConversationInput | ChatMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutConversationInput | ChatMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutConversationInput | ChatMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutConversationNestedInput = {
    create?: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput> | ChatMessageCreateWithoutConversationInput[] | ChatMessageUncheckedCreateWithoutConversationInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutConversationInput | ChatMessageCreateOrConnectWithoutConversationInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutConversationInput | ChatMessageUpsertWithWhereUniqueWithoutConversationInput[]
    createMany?: ChatMessageCreateManyConversationInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutConversationInput | ChatMessageUpdateWithWhereUniqueWithoutConversationInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutConversationInput | ChatMessageUpdateManyWithWhereWithoutConversationInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type DriverCreateNestedOneWithoutSentMessagesInput = {
    create?: XOR<DriverCreateWithoutSentMessagesInput, DriverUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSentMessagesInput
    connect?: DriverWhereUniqueInput
  }

  export type ChatConversationCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatConversationCreateOrConnectWithoutMessagesInput
    connect?: ChatConversationWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DriverUpdateOneRequiredWithoutSentMessagesNestedInput = {
    create?: XOR<DriverCreateWithoutSentMessagesInput, DriverUncheckedCreateWithoutSentMessagesInput>
    connectOrCreate?: DriverCreateOrConnectWithoutSentMessagesInput
    upsert?: DriverUpsertWithoutSentMessagesInput
    connect?: DriverWhereUniqueInput
    update?: XOR<XOR<DriverUpdateToOneWithWhereWithoutSentMessagesInput, DriverUpdateWithoutSentMessagesInput>, DriverUncheckedUpdateWithoutSentMessagesInput>
  }

  export type ChatConversationUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatConversationCreateOrConnectWithoutMessagesInput
    upsert?: ChatConversationUpsertWithoutMessagesInput
    connect?: ChatConversationWhereUniqueInput
    update?: XOR<XOR<ChatConversationUpdateToOneWithWhereWithoutMessagesInput, ChatConversationUpdateWithoutMessagesInput>, ChatConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type VehicleCreateWithoutAssignedDriverInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reports?: DriverReportCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutAssignedDriverInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    reports?: DriverReportUncheckedCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutAssignedDriverInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
  }

  export type DriverReportCreateWithoutDriverInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicle?: VehicleCreateNestedOneWithoutReportsInput
  }

  export type DriverReportUncheckedCreateWithoutDriverInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleId?: string | null
  }

  export type DriverReportCreateOrConnectWithoutDriverInput = {
    where: DriverReportWhereUniqueInput
    create: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput>
  }

  export type DriverReportCreateManyDriverInputEnvelope = {
    data: DriverReportCreateManyDriverInput | DriverReportCreateManyDriverInput[]
  }

  export type PartsExchangeCreateWithoutDriverInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicle: VehicleCreateNestedOneWithoutPartsExchangesInput
  }

  export type PartsExchangeUncheckedCreateWithoutDriverInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleId: string
  }

  export type PartsExchangeCreateOrConnectWithoutDriverInput = {
    where: PartsExchangeWhereUniqueInput
    create: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput>
  }

  export type PartsExchangeCreateManyDriverInputEnvelope = {
    data: PartsExchangeCreateManyDriverInput | PartsExchangeCreateManyDriverInput[]
  }

  export type SalesRecordCreateWithoutDriverInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesRecordUncheckedCreateWithoutDriverInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SalesRecordCreateOrConnectWithoutDriverInput = {
    where: SalesRecordWhereUniqueInput
    create: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput>
  }

  export type SalesRecordCreateManyDriverInputEnvelope = {
    data: SalesRecordCreateManyDriverInput | SalesRecordCreateManyDriverInput[]
  }

  export type LedgerEntryCreateWithoutDriverInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
  }

  export type LedgerEntryUncheckedCreateWithoutDriverInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
  }

  export type LedgerEntryCreateOrConnectWithoutDriverInput = {
    where: LedgerEntryWhereUniqueInput
    create: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput>
  }

  export type LedgerEntryCreateManyDriverInputEnvelope = {
    data: LedgerEntryCreateManyDriverInput | LedgerEntryCreateManyDriverInput[]
  }

  export type ApplicationCreateWithoutApprovedDriverInput = {
    id?: string
    fullName: string
    phone: string
    email?: string | null
    reason: string
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationUncheckedCreateWithoutApprovedDriverInput = {
    id?: string
    fullName: string
    phone: string
    email?: string | null
    reason: string
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApplicationCreateOrConnectWithoutApprovedDriverInput = {
    where: ApplicationWhereUniqueInput
    create: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
  }

  export type ChatMessageCreateWithoutSenderInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    conversation: ChatConversationCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateWithoutSenderInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    conversationId: string
  }

  export type ChatMessageCreateOrConnectWithoutSenderInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput>
  }

  export type ChatMessageCreateManySenderInputEnvelope = {
    data: ChatMessageCreateManySenderInput | ChatMessageCreateManySenderInput[]
  }

  export type ChatConversationCreateWithoutDriver1Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver2: DriverCreateNestedOneWithoutConversations2Input
    messages?: ChatMessageCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUncheckedCreateWithoutDriver1Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver2Id: string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationCreateOrConnectWithoutDriver1Input = {
    where: ChatConversationWhereUniqueInput
    create: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input>
  }

  export type ChatConversationCreateManyDriver1InputEnvelope = {
    data: ChatConversationCreateManyDriver1Input | ChatConversationCreateManyDriver1Input[]
  }

  export type ChatConversationCreateWithoutDriver2Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1: DriverCreateNestedOneWithoutConversations1Input
    messages?: ChatMessageCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationUncheckedCreateWithoutDriver2Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1Id: string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutConversationInput
  }

  export type ChatConversationCreateOrConnectWithoutDriver2Input = {
    where: ChatConversationWhereUniqueInput
    create: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input>
  }

  export type ChatConversationCreateManyDriver2InputEnvelope = {
    data: ChatConversationCreateManyDriver2Input | ChatConversationCreateManyDriver2Input[]
  }

  export type VehicleUpsertWithoutAssignedDriverInput = {
    update: XOR<VehicleUpdateWithoutAssignedDriverInput, VehicleUncheckedUpdateWithoutAssignedDriverInput>
    create: XOR<VehicleCreateWithoutAssignedDriverInput, VehicleUncheckedCreateWithoutAssignedDriverInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutAssignedDriverInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutAssignedDriverInput, VehicleUncheckedUpdateWithoutAssignedDriverInput>
  }

  export type VehicleUpdateWithoutAssignedDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: DriverReportUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutAssignedDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    reports?: DriverReportUncheckedUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type DriverReportUpsertWithWhereUniqueWithoutDriverInput = {
    where: DriverReportWhereUniqueInput
    update: XOR<DriverReportUpdateWithoutDriverInput, DriverReportUncheckedUpdateWithoutDriverInput>
    create: XOR<DriverReportCreateWithoutDriverInput, DriverReportUncheckedCreateWithoutDriverInput>
  }

  export type DriverReportUpdateWithWhereUniqueWithoutDriverInput = {
    where: DriverReportWhereUniqueInput
    data: XOR<DriverReportUpdateWithoutDriverInput, DriverReportUncheckedUpdateWithoutDriverInput>
  }

  export type DriverReportUpdateManyWithWhereWithoutDriverInput = {
    where: DriverReportScalarWhereInput
    data: XOR<DriverReportUpdateManyMutationInput, DriverReportUncheckedUpdateManyWithoutDriverInput>
  }

  export type DriverReportScalarWhereInput = {
    AND?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
    OR?: DriverReportScalarWhereInput[]
    NOT?: DriverReportScalarWhereInput | DriverReportScalarWhereInput[]
    id?: StringFilter<"DriverReport"> | string
    type?: StringFilter<"DriverReport"> | string
    description?: StringFilter<"DriverReport"> | string
    photoUrl?: StringNullableFilter<"DriverReport"> | string | null
    suggestedSeverity?: StringNullableFilter<"DriverReport"> | string | null
    status?: StringFilter<"DriverReport"> | string
    createdAt?: DateTimeFilter<"DriverReport"> | Date | string
    updatedAt?: DateTimeFilter<"DriverReport"> | Date | string
    driverId?: StringFilter<"DriverReport"> | string
    vehicleId?: StringNullableFilter<"DriverReport"> | string | null
  }

  export type PartsExchangeUpsertWithWhereUniqueWithoutDriverInput = {
    where: PartsExchangeWhereUniqueInput
    update: XOR<PartsExchangeUpdateWithoutDriverInput, PartsExchangeUncheckedUpdateWithoutDriverInput>
    create: XOR<PartsExchangeCreateWithoutDriverInput, PartsExchangeUncheckedCreateWithoutDriverInput>
  }

  export type PartsExchangeUpdateWithWhereUniqueWithoutDriverInput = {
    where: PartsExchangeWhereUniqueInput
    data: XOR<PartsExchangeUpdateWithoutDriverInput, PartsExchangeUncheckedUpdateWithoutDriverInput>
  }

  export type PartsExchangeUpdateManyWithWhereWithoutDriverInput = {
    where: PartsExchangeScalarWhereInput
    data: XOR<PartsExchangeUpdateManyMutationInput, PartsExchangeUncheckedUpdateManyWithoutDriverInput>
  }

  export type PartsExchangeScalarWhereInput = {
    AND?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
    OR?: PartsExchangeScalarWhereInput[]
    NOT?: PartsExchangeScalarWhereInput | PartsExchangeScalarWhereInput[]
    id?: StringFilter<"PartsExchange"> | string
    partName?: StringFilter<"PartsExchange"> | string
    cost?: FloatFilter<"PartsExchange"> | number
    date?: DateTimeFilter<"PartsExchange"> | Date | string
    photoUrl?: StringNullableFilter<"PartsExchange"> | string | null
    receiptUrl?: StringNullableFilter<"PartsExchange"> | string | null
    reimbursementStatus?: StringFilter<"PartsExchange"> | string
    createdAt?: DateTimeFilter<"PartsExchange"> | Date | string
    updatedAt?: DateTimeFilter<"PartsExchange"> | Date | string
    driverId?: StringFilter<"PartsExchange"> | string
    vehicleId?: StringFilter<"PartsExchange"> | string
  }

  export type SalesRecordUpsertWithWhereUniqueWithoutDriverInput = {
    where: SalesRecordWhereUniqueInput
    update: XOR<SalesRecordUpdateWithoutDriverInput, SalesRecordUncheckedUpdateWithoutDriverInput>
    create: XOR<SalesRecordCreateWithoutDriverInput, SalesRecordUncheckedCreateWithoutDriverInput>
  }

  export type SalesRecordUpdateWithWhereUniqueWithoutDriverInput = {
    where: SalesRecordWhereUniqueInput
    data: XOR<SalesRecordUpdateWithoutDriverInput, SalesRecordUncheckedUpdateWithoutDriverInput>
  }

  export type SalesRecordUpdateManyWithWhereWithoutDriverInput = {
    where: SalesRecordScalarWhereInput
    data: XOR<SalesRecordUpdateManyMutationInput, SalesRecordUncheckedUpdateManyWithoutDriverInput>
  }

  export type SalesRecordScalarWhereInput = {
    AND?: SalesRecordScalarWhereInput | SalesRecordScalarWhereInput[]
    OR?: SalesRecordScalarWhereInput[]
    NOT?: SalesRecordScalarWhereInput | SalesRecordScalarWhereInput[]
    id?: StringFilter<"SalesRecord"> | string
    weekLabel?: StringFilter<"SalesRecord"> | string
    amount?: FloatFilter<"SalesRecord"> | number
    paymentMethod?: StringFilter<"SalesRecord"> | string
    momoReference?: StringNullableFilter<"SalesRecord"> | string | null
    confirmationStatus?: StringFilter<"SalesRecord"> | string
    createdAt?: DateTimeFilter<"SalesRecord"> | Date | string
    updatedAt?: DateTimeFilter<"SalesRecord"> | Date | string
    driverId?: StringFilter<"SalesRecord"> | string
  }

  export type LedgerEntryUpsertWithWhereUniqueWithoutDriverInput = {
    where: LedgerEntryWhereUniqueInput
    update: XOR<LedgerEntryUpdateWithoutDriverInput, LedgerEntryUncheckedUpdateWithoutDriverInput>
    create: XOR<LedgerEntryCreateWithoutDriverInput, LedgerEntryUncheckedCreateWithoutDriverInput>
  }

  export type LedgerEntryUpdateWithWhereUniqueWithoutDriverInput = {
    where: LedgerEntryWhereUniqueInput
    data: XOR<LedgerEntryUpdateWithoutDriverInput, LedgerEntryUncheckedUpdateWithoutDriverInput>
  }

  export type LedgerEntryUpdateManyWithWhereWithoutDriverInput = {
    where: LedgerEntryScalarWhereInput
    data: XOR<LedgerEntryUpdateManyMutationInput, LedgerEntryUncheckedUpdateManyWithoutDriverInput>
  }

  export type LedgerEntryScalarWhereInput = {
    AND?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
    OR?: LedgerEntryScalarWhereInput[]
    NOT?: LedgerEntryScalarWhereInput | LedgerEntryScalarWhereInput[]
    id?: StringFilter<"LedgerEntry"> | string
    amount?: FloatFilter<"LedgerEntry"> | number
    direction?: StringFilter<"LedgerEntry"> | string
    description?: StringFilter<"LedgerEntry"> | string
    createdAt?: DateTimeFilter<"LedgerEntry"> | Date | string
    driverId?: StringFilter<"LedgerEntry"> | string
  }

  export type ApplicationUpsertWithoutApprovedDriverInput = {
    update: XOR<ApplicationUpdateWithoutApprovedDriverInput, ApplicationUncheckedUpdateWithoutApprovedDriverInput>
    create: XOR<ApplicationCreateWithoutApprovedDriverInput, ApplicationUncheckedCreateWithoutApprovedDriverInput>
    where?: ApplicationWhereInput
  }

  export type ApplicationUpdateToOneWithWhereWithoutApprovedDriverInput = {
    where?: ApplicationWhereInput
    data: XOR<ApplicationUpdateWithoutApprovedDriverInput, ApplicationUncheckedUpdateWithoutApprovedDriverInput>
  }

  export type ApplicationUpdateWithoutApprovedDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApplicationUncheckedUpdateWithoutApprovedDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    reason?: StringFieldUpdateOperationsInput | string
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutSenderInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutSenderInput, ChatMessageUncheckedUpdateWithoutSenderInput>
    create: XOR<ChatMessageCreateWithoutSenderInput, ChatMessageUncheckedCreateWithoutSenderInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutSenderInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutSenderInput, ChatMessageUncheckedUpdateWithoutSenderInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutSenderInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutSenderInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    mediaUrl?: StringNullableFilter<"ChatMessage"> | string | null
    mediaType?: StringNullableFilter<"ChatMessage"> | string | null
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    read?: BoolFilter<"ChatMessage"> | boolean
    senderId?: StringFilter<"ChatMessage"> | string
    conversationId?: StringFilter<"ChatMessage"> | string
  }

  export type ChatConversationUpsertWithWhereUniqueWithoutDriver1Input = {
    where: ChatConversationWhereUniqueInput
    update: XOR<ChatConversationUpdateWithoutDriver1Input, ChatConversationUncheckedUpdateWithoutDriver1Input>
    create: XOR<ChatConversationCreateWithoutDriver1Input, ChatConversationUncheckedCreateWithoutDriver1Input>
  }

  export type ChatConversationUpdateWithWhereUniqueWithoutDriver1Input = {
    where: ChatConversationWhereUniqueInput
    data: XOR<ChatConversationUpdateWithoutDriver1Input, ChatConversationUncheckedUpdateWithoutDriver1Input>
  }

  export type ChatConversationUpdateManyWithWhereWithoutDriver1Input = {
    where: ChatConversationScalarWhereInput
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyWithoutDriver1Input>
  }

  export type ChatConversationScalarWhereInput = {
    AND?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
    OR?: ChatConversationScalarWhereInput[]
    NOT?: ChatConversationScalarWhereInput | ChatConversationScalarWhereInput[]
    id?: StringFilter<"ChatConversation"> | string
    createdAt?: DateTimeFilter<"ChatConversation"> | Date | string
    updatedAt?: DateTimeFilter<"ChatConversation"> | Date | string
    driver1Id?: StringFilter<"ChatConversation"> | string
    driver2Id?: StringFilter<"ChatConversation"> | string
  }

  export type ChatConversationUpsertWithWhereUniqueWithoutDriver2Input = {
    where: ChatConversationWhereUniqueInput
    update: XOR<ChatConversationUpdateWithoutDriver2Input, ChatConversationUncheckedUpdateWithoutDriver2Input>
    create: XOR<ChatConversationCreateWithoutDriver2Input, ChatConversationUncheckedCreateWithoutDriver2Input>
  }

  export type ChatConversationUpdateWithWhereUniqueWithoutDriver2Input = {
    where: ChatConversationWhereUniqueInput
    data: XOR<ChatConversationUpdateWithoutDriver2Input, ChatConversationUncheckedUpdateWithoutDriver2Input>
  }

  export type ChatConversationUpdateManyWithWhereWithoutDriver2Input = {
    where: ChatConversationScalarWhereInput
    data: XOR<ChatConversationUpdateManyMutationInput, ChatConversationUncheckedUpdateManyWithoutDriver2Input>
  }

  export type DriverCreateWithoutAssignedVehicleInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutAssignedVehicleInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutAssignedVehicleInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutAssignedVehicleInput, DriverUncheckedCreateWithoutAssignedVehicleInput>
  }

  export type DriverReportCreateWithoutVehicleInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutReportsInput
  }

  export type DriverReportUncheckedCreateWithoutVehicleInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type DriverReportCreateOrConnectWithoutVehicleInput = {
    where: DriverReportWhereUniqueInput
    create: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput>
  }

  export type DriverReportCreateManyVehicleInputEnvelope = {
    data: DriverReportCreateManyVehicleInput | DriverReportCreateManyVehicleInput[]
  }

  export type PartsExchangeCreateWithoutVehicleInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver: DriverCreateNestedOneWithoutPartsExchangesInput
  }

  export type PartsExchangeUncheckedCreateWithoutVehicleInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type PartsExchangeCreateOrConnectWithoutVehicleInput = {
    where: PartsExchangeWhereUniqueInput
    create: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput>
  }

  export type PartsExchangeCreateManyVehicleInputEnvelope = {
    data: PartsExchangeCreateManyVehicleInput | PartsExchangeCreateManyVehicleInput[]
  }

  export type LocationPingCreateWithoutVehicleInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    gpsDeviceId?: string | null
  }

  export type LocationPingUncheckedCreateWithoutVehicleInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    gpsDeviceId?: string | null
  }

  export type LocationPingCreateOrConnectWithoutVehicleInput = {
    where: LocationPingWhereUniqueInput
    create: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput>
  }

  export type LocationPingCreateManyVehicleInputEnvelope = {
    data: LocationPingCreateManyVehicleInput | LocationPingCreateManyVehicleInput[]
  }

  export type DriverUpsertWithoutAssignedVehicleInput = {
    update: XOR<DriverUpdateWithoutAssignedVehicleInput, DriverUncheckedUpdateWithoutAssignedVehicleInput>
    create: XOR<DriverCreateWithoutAssignedVehicleInput, DriverUncheckedCreateWithoutAssignedVehicleInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutAssignedVehicleInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutAssignedVehicleInput, DriverUncheckedUpdateWithoutAssignedVehicleInput>
  }

  export type DriverUpdateWithoutAssignedVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutAssignedVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type DriverReportUpsertWithWhereUniqueWithoutVehicleInput = {
    where: DriverReportWhereUniqueInput
    update: XOR<DriverReportUpdateWithoutVehicleInput, DriverReportUncheckedUpdateWithoutVehicleInput>
    create: XOR<DriverReportCreateWithoutVehicleInput, DriverReportUncheckedCreateWithoutVehicleInput>
  }

  export type DriverReportUpdateWithWhereUniqueWithoutVehicleInput = {
    where: DriverReportWhereUniqueInput
    data: XOR<DriverReportUpdateWithoutVehicleInput, DriverReportUncheckedUpdateWithoutVehicleInput>
  }

  export type DriverReportUpdateManyWithWhereWithoutVehicleInput = {
    where: DriverReportScalarWhereInput
    data: XOR<DriverReportUpdateManyMutationInput, DriverReportUncheckedUpdateManyWithoutVehicleInput>
  }

  export type PartsExchangeUpsertWithWhereUniqueWithoutVehicleInput = {
    where: PartsExchangeWhereUniqueInput
    update: XOR<PartsExchangeUpdateWithoutVehicleInput, PartsExchangeUncheckedUpdateWithoutVehicleInput>
    create: XOR<PartsExchangeCreateWithoutVehicleInput, PartsExchangeUncheckedCreateWithoutVehicleInput>
  }

  export type PartsExchangeUpdateWithWhereUniqueWithoutVehicleInput = {
    where: PartsExchangeWhereUniqueInput
    data: XOR<PartsExchangeUpdateWithoutVehicleInput, PartsExchangeUncheckedUpdateWithoutVehicleInput>
  }

  export type PartsExchangeUpdateManyWithWhereWithoutVehicleInput = {
    where: PartsExchangeScalarWhereInput
    data: XOR<PartsExchangeUpdateManyMutationInput, PartsExchangeUncheckedUpdateManyWithoutVehicleInput>
  }

  export type LocationPingUpsertWithWhereUniqueWithoutVehicleInput = {
    where: LocationPingWhereUniqueInput
    update: XOR<LocationPingUpdateWithoutVehicleInput, LocationPingUncheckedUpdateWithoutVehicleInput>
    create: XOR<LocationPingCreateWithoutVehicleInput, LocationPingUncheckedCreateWithoutVehicleInput>
  }

  export type LocationPingUpdateWithWhereUniqueWithoutVehicleInput = {
    where: LocationPingWhereUniqueInput
    data: XOR<LocationPingUpdateWithoutVehicleInput, LocationPingUncheckedUpdateWithoutVehicleInput>
  }

  export type LocationPingUpdateManyWithWhereWithoutVehicleInput = {
    where: LocationPingScalarWhereInput
    data: XOR<LocationPingUpdateManyMutationInput, LocationPingUncheckedUpdateManyWithoutVehicleInput>
  }

  export type LocationPingScalarWhereInput = {
    AND?: LocationPingScalarWhereInput | LocationPingScalarWhereInput[]
    OR?: LocationPingScalarWhereInput[]
    NOT?: LocationPingScalarWhereInput | LocationPingScalarWhereInput[]
    id?: StringFilter<"LocationPing"> | string
    lat?: FloatFilter<"LocationPing"> | number
    lng?: FloatFilter<"LocationPing"> | number
    timestamp?: DateTimeFilter<"LocationPing"> | Date | string
    vehicleId?: StringFilter<"LocationPing"> | string
    gpsDeviceId?: StringNullableFilter<"LocationPing"> | string | null
  }

  export type DriverCreateWithoutApplicationRefInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutApplicationRefInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutApplicationRefInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutApplicationRefInput, DriverUncheckedCreateWithoutApplicationRefInput>
  }

  export type DriverUpsertWithoutApplicationRefInput = {
    update: XOR<DriverUpdateWithoutApplicationRefInput, DriverUncheckedUpdateWithoutApplicationRefInput>
    create: XOR<DriverCreateWithoutApplicationRefInput, DriverUncheckedCreateWithoutApplicationRefInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutApplicationRefInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutApplicationRefInput, DriverUncheckedUpdateWithoutApplicationRefInput>
  }

  export type DriverUpdateWithoutApplicationRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutApplicationRefInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type DriverCreateWithoutReportsInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutReportsInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutReportsInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutReportsInput, DriverUncheckedCreateWithoutReportsInput>
  }

  export type VehicleCreateWithoutReportsInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriver?: DriverCreateNestedOneWithoutAssignedVehicleInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutReportsInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriverId?: string | null
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutReportsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutReportsInput, VehicleUncheckedCreateWithoutReportsInput>
  }

  export type DriverUpsertWithoutReportsInput = {
    update: XOR<DriverUpdateWithoutReportsInput, DriverUncheckedUpdateWithoutReportsInput>
    create: XOR<DriverCreateWithoutReportsInput, DriverUncheckedCreateWithoutReportsInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutReportsInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutReportsInput, DriverUncheckedUpdateWithoutReportsInput>
  }

  export type DriverUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type VehicleUpsertWithoutReportsInput = {
    update: XOR<VehicleUpdateWithoutReportsInput, VehicleUncheckedUpdateWithoutReportsInput>
    create: XOR<VehicleCreateWithoutReportsInput, VehicleUncheckedCreateWithoutReportsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutReportsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutReportsInput, VehicleUncheckedUpdateWithoutReportsInput>
  }

  export type VehicleUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriver?: DriverUpdateOneWithoutAssignedVehicleNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutReportsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type DriverCreateWithoutPartsExchangesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutPartsExchangesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutPartsExchangesInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutPartsExchangesInput, DriverUncheckedCreateWithoutPartsExchangesInput>
  }

  export type VehicleCreateWithoutPartsExchangesInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriver?: DriverCreateNestedOneWithoutAssignedVehicleInput
    reports?: DriverReportCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutPartsExchangesInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriverId?: string | null
    reports?: DriverReportUncheckedCreateNestedManyWithoutVehicleInput
    locationPings?: LocationPingUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutPartsExchangesInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutPartsExchangesInput, VehicleUncheckedCreateWithoutPartsExchangesInput>
  }

  export type DriverUpsertWithoutPartsExchangesInput = {
    update: XOR<DriverUpdateWithoutPartsExchangesInput, DriverUncheckedUpdateWithoutPartsExchangesInput>
    create: XOR<DriverCreateWithoutPartsExchangesInput, DriverUncheckedCreateWithoutPartsExchangesInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutPartsExchangesInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutPartsExchangesInput, DriverUncheckedUpdateWithoutPartsExchangesInput>
  }

  export type DriverUpdateWithoutPartsExchangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutPartsExchangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type VehicleUpsertWithoutPartsExchangesInput = {
    update: XOR<VehicleUpdateWithoutPartsExchangesInput, VehicleUncheckedUpdateWithoutPartsExchangesInput>
    create: XOR<VehicleCreateWithoutPartsExchangesInput, VehicleUncheckedCreateWithoutPartsExchangesInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutPartsExchangesInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutPartsExchangesInput, VehicleUncheckedUpdateWithoutPartsExchangesInput>
  }

  export type VehicleUpdateWithoutPartsExchangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriver?: DriverUpdateOneWithoutAssignedVehicleNestedInput
    reports?: DriverReportUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutPartsExchangesInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    reports?: DriverReportUncheckedUpdateManyWithoutVehicleNestedInput
    locationPings?: LocationPingUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type DriverCreateWithoutSalesRecordsInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutSalesRecordsInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutSalesRecordsInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutSalesRecordsInput, DriverUncheckedCreateWithoutSalesRecordsInput>
  }

  export type DriverUpsertWithoutSalesRecordsInput = {
    update: XOR<DriverUpdateWithoutSalesRecordsInput, DriverUncheckedUpdateWithoutSalesRecordsInput>
    create: XOR<DriverCreateWithoutSalesRecordsInput, DriverUncheckedCreateWithoutSalesRecordsInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutSalesRecordsInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutSalesRecordsInput, DriverUncheckedUpdateWithoutSalesRecordsInput>
  }

  export type DriverUpdateWithoutSalesRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutSalesRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type DriverCreateWithoutLedgerEntriesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutLedgerEntriesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutLedgerEntriesInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutLedgerEntriesInput, DriverUncheckedCreateWithoutLedgerEntriesInput>
  }

  export type DriverUpsertWithoutLedgerEntriesInput = {
    update: XOR<DriverUpdateWithoutLedgerEntriesInput, DriverUncheckedUpdateWithoutLedgerEntriesInput>
    create: XOR<DriverCreateWithoutLedgerEntriesInput, DriverUncheckedCreateWithoutLedgerEntriesInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutLedgerEntriesInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutLedgerEntriesInput, DriverUncheckedUpdateWithoutLedgerEntriesInput>
  }

  export type DriverUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutLedgerEntriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type VehicleCreateWithoutLocationPingsInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriver?: DriverCreateNestedOneWithoutAssignedVehicleInput
    reports?: DriverReportCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutVehicleInput
  }

  export type VehicleUncheckedCreateWithoutLocationPingsInput = {
    id?: string
    plateNumber: string
    make: string
    model: string
    year: number
    severityStatus?: string
    gpsDeviceId?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    assignedDriverId?: string | null
    reports?: DriverReportUncheckedCreateNestedManyWithoutVehicleInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutVehicleInput
  }

  export type VehicleCreateOrConnectWithoutLocationPingsInput = {
    where: VehicleWhereUniqueInput
    create: XOR<VehicleCreateWithoutLocationPingsInput, VehicleUncheckedCreateWithoutLocationPingsInput>
  }

  export type VehicleUpsertWithoutLocationPingsInput = {
    update: XOR<VehicleUpdateWithoutLocationPingsInput, VehicleUncheckedUpdateWithoutLocationPingsInput>
    create: XOR<VehicleCreateWithoutLocationPingsInput, VehicleUncheckedCreateWithoutLocationPingsInput>
    where?: VehicleWhereInput
  }

  export type VehicleUpdateToOneWithWhereWithoutLocationPingsInput = {
    where?: VehicleWhereInput
    data: XOR<VehicleUpdateWithoutLocationPingsInput, VehicleUncheckedUpdateWithoutLocationPingsInput>
  }

  export type VehicleUpdateWithoutLocationPingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriver?: DriverUpdateOneWithoutAssignedVehicleNestedInput
    reports?: DriverReportUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutVehicleNestedInput
  }

  export type VehicleUncheckedUpdateWithoutLocationPingsInput = {
    id?: StringFieldUpdateOperationsInput | string
    plateNumber?: StringFieldUpdateOperationsInput | string
    make?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    year?: IntFieldUpdateOperationsInput | number
    severityStatus?: StringFieldUpdateOperationsInput | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    assignedDriverId?: NullableStringFieldUpdateOperationsInput | string | null
    reports?: DriverReportUncheckedUpdateManyWithoutVehicleNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutVehicleNestedInput
  }

  export type DriverCreateWithoutConversations1Input = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutConversations1Input = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutConversations1Input = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutConversations1Input, DriverUncheckedCreateWithoutConversations1Input>
  }

  export type DriverCreateWithoutConversations2Input = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
  }

  export type DriverUncheckedCreateWithoutConversations2Input = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    sentMessages?: ChatMessageUncheckedCreateNestedManyWithoutSenderInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
  }

  export type DriverCreateOrConnectWithoutConversations2Input = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutConversations2Input, DriverUncheckedCreateWithoutConversations2Input>
  }

  export type ChatMessageCreateWithoutConversationInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    sender: DriverCreateNestedOneWithoutSentMessagesInput
  }

  export type ChatMessageUncheckedCreateWithoutConversationInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    senderId: string
  }

  export type ChatMessageCreateOrConnectWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput>
  }

  export type ChatMessageCreateManyConversationInputEnvelope = {
    data: ChatMessageCreateManyConversationInput | ChatMessageCreateManyConversationInput[]
  }

  export type DriverUpsertWithoutConversations1Input = {
    update: XOR<DriverUpdateWithoutConversations1Input, DriverUncheckedUpdateWithoutConversations1Input>
    create: XOR<DriverCreateWithoutConversations1Input, DriverUncheckedCreateWithoutConversations1Input>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutConversations1Input = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutConversations1Input, DriverUncheckedUpdateWithoutConversations1Input>
  }

  export type DriverUpdateWithoutConversations1Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutConversations1Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUpsertWithoutConversations2Input = {
    update: XOR<DriverUpdateWithoutConversations2Input, DriverUncheckedUpdateWithoutConversations2Input>
    create: XOR<DriverCreateWithoutConversations2Input, DriverUncheckedCreateWithoutConversations2Input>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutConversations2Input = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutConversations2Input, DriverUncheckedUpdateWithoutConversations2Input>
  }

  export type DriverUpdateWithoutConversations2Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
  }

  export type DriverUncheckedUpdateWithoutConversations2Input = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    sentMessages?: ChatMessageUncheckedUpdateManyWithoutSenderNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutConversationInput, ChatMessageUncheckedUpdateWithoutConversationInput>
    create: XOR<ChatMessageCreateWithoutConversationInput, ChatMessageUncheckedCreateWithoutConversationInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutConversationInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutConversationInput, ChatMessageUncheckedUpdateWithoutConversationInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutConversationInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutConversationInput>
  }

  export type DriverCreateWithoutSentMessagesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationCreateNestedOneWithoutApprovedDriverInput
    conversations1?: ChatConversationCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationCreateNestedManyWithoutDriver2Input
  }

  export type DriverUncheckedCreateWithoutSentMessagesInput = {
    id?: string
    name: string
    phone: string
    email?: string | null
    licenseDocUrl?: string | null
    ghanaCardUrl?: string | null
    irisScanUrl?: string | null
    status?: string
    balance?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    passwordHash?: string
    assignedVehicle?: VehicleUncheckedCreateNestedOneWithoutAssignedDriverInput
    reports?: DriverReportUncheckedCreateNestedManyWithoutDriverInput
    partsExchanges?: PartsExchangeUncheckedCreateNestedManyWithoutDriverInput
    salesRecords?: SalesRecordUncheckedCreateNestedManyWithoutDriverInput
    ledgerEntries?: LedgerEntryUncheckedCreateNestedManyWithoutDriverInput
    applicationRef?: ApplicationUncheckedCreateNestedOneWithoutApprovedDriverInput
    conversations1?: ChatConversationUncheckedCreateNestedManyWithoutDriver1Input
    conversations2?: ChatConversationUncheckedCreateNestedManyWithoutDriver2Input
  }

  export type DriverCreateOrConnectWithoutSentMessagesInput = {
    where: DriverWhereUniqueInput
    create: XOR<DriverCreateWithoutSentMessagesInput, DriverUncheckedCreateWithoutSentMessagesInput>
  }

  export type ChatConversationCreateWithoutMessagesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1: DriverCreateNestedOneWithoutConversations1Input
    driver2: DriverCreateNestedOneWithoutConversations2Input
  }

  export type ChatConversationUncheckedCreateWithoutMessagesInput = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1Id: string
    driver2Id: string
  }

  export type ChatConversationCreateOrConnectWithoutMessagesInput = {
    where: ChatConversationWhereUniqueInput
    create: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
  }

  export type DriverUpsertWithoutSentMessagesInput = {
    update: XOR<DriverUpdateWithoutSentMessagesInput, DriverUncheckedUpdateWithoutSentMessagesInput>
    create: XOR<DriverCreateWithoutSentMessagesInput, DriverUncheckedCreateWithoutSentMessagesInput>
    where?: DriverWhereInput
  }

  export type DriverUpdateToOneWithWhereWithoutSentMessagesInput = {
    where?: DriverWhereInput
    data: XOR<DriverUpdateWithoutSentMessagesInput, DriverUncheckedUpdateWithoutSentMessagesInput>
  }

  export type DriverUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUpdateOneWithoutApprovedDriverNestedInput
    conversations1?: ChatConversationUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUpdateManyWithoutDriver2NestedInput
  }

  export type DriverUncheckedUpdateWithoutSentMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    phone?: StringFieldUpdateOperationsInput | string
    email?: NullableStringFieldUpdateOperationsInput | string | null
    licenseDocUrl?: NullableStringFieldUpdateOperationsInput | string | null
    ghanaCardUrl?: NullableStringFieldUpdateOperationsInput | string | null
    irisScanUrl?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    balance?: FloatFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    passwordHash?: StringFieldUpdateOperationsInput | string
    assignedVehicle?: VehicleUncheckedUpdateOneWithoutAssignedDriverNestedInput
    reports?: DriverReportUncheckedUpdateManyWithoutDriverNestedInput
    partsExchanges?: PartsExchangeUncheckedUpdateManyWithoutDriverNestedInput
    salesRecords?: SalesRecordUncheckedUpdateManyWithoutDriverNestedInput
    ledgerEntries?: LedgerEntryUncheckedUpdateManyWithoutDriverNestedInput
    applicationRef?: ApplicationUncheckedUpdateOneWithoutApprovedDriverNestedInput
    conversations1?: ChatConversationUncheckedUpdateManyWithoutDriver1NestedInput
    conversations2?: ChatConversationUncheckedUpdateManyWithoutDriver2NestedInput
  }

  export type ChatConversationUpsertWithoutMessagesInput = {
    update: XOR<ChatConversationUpdateWithoutMessagesInput, ChatConversationUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatConversationCreateWithoutMessagesInput, ChatConversationUncheckedCreateWithoutMessagesInput>
    where?: ChatConversationWhereInput
  }

  export type ChatConversationUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatConversationWhereInput
    data: XOR<ChatConversationUpdateWithoutMessagesInput, ChatConversationUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatConversationUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1?: DriverUpdateOneRequiredWithoutConversations1NestedInput
    driver2?: DriverUpdateOneRequiredWithoutConversations2NestedInput
  }

  export type ChatConversationUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1Id?: StringFieldUpdateOperationsInput | string
    driver2Id?: StringFieldUpdateOperationsInput | string
  }

  export type DriverReportCreateManyDriverInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleId?: string | null
  }

  export type PartsExchangeCreateManyDriverInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    vehicleId: string
  }

  export type SalesRecordCreateManyDriverInput = {
    id?: string
    weekLabel: string
    amount: number
    paymentMethod: string
    momoReference?: string | null
    confirmationStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LedgerEntryCreateManyDriverInput = {
    id?: string
    amount: number
    direction: string
    description: string
    createdAt?: Date | string
  }

  export type ChatMessageCreateManySenderInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    conversationId: string
  }

  export type ChatConversationCreateManyDriver1Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver2Id: string
  }

  export type ChatConversationCreateManyDriver2Input = {
    id?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driver1Id: string
  }

  export type DriverReportUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneWithoutReportsNestedInput
  }

  export type DriverReportUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type DriverReportUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PartsExchangeUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicle?: VehicleUpdateOneRequiredWithoutPartsExchangesNestedInput
  }

  export type PartsExchangeUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: StringFieldUpdateOperationsInput | string
  }

  export type PartsExchangeUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    vehicleId?: StringFieldUpdateOperationsInput | string
  }

  export type SalesRecordUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesRecordUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SalesRecordUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    weekLabel?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentMethod?: StringFieldUpdateOperationsInput | string
    momoReference?: NullableStringFieldUpdateOperationsInput | string | null
    confirmationStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LedgerEntryUncheckedUpdateManyWithoutDriverInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    direction?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    conversation?: ChatConversationUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    conversationId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutSenderInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    conversationId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatConversationUpdateWithoutDriver1Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver2?: DriverUpdateOneRequiredWithoutConversations2NestedInput
    messages?: ChatMessageUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateWithoutDriver1Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver2Id?: StringFieldUpdateOperationsInput | string
    messages?: ChatMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateManyWithoutDriver1Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver2Id?: StringFieldUpdateOperationsInput | string
  }

  export type ChatConversationUpdateWithoutDriver2Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1?: DriverUpdateOneRequiredWithoutConversations1NestedInput
    messages?: ChatMessageUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateWithoutDriver2Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1Id?: StringFieldUpdateOperationsInput | string
    messages?: ChatMessageUncheckedUpdateManyWithoutConversationNestedInput
  }

  export type ChatConversationUncheckedUpdateManyWithoutDriver2Input = {
    id?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver1Id?: StringFieldUpdateOperationsInput | string
  }

  export type DriverReportCreateManyVehicleInput = {
    id?: string
    type: string
    description: string
    photoUrl?: string | null
    suggestedSeverity?: string | null
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type PartsExchangeCreateManyVehicleInput = {
    id?: string
    partName: string
    cost: number
    date: Date | string
    photoUrl?: string | null
    receiptUrl?: string | null
    reimbursementStatus?: string
    createdAt?: Date | string
    updatedAt?: Date | string
    driverId: string
  }

  export type LocationPingCreateManyVehicleInput = {
    id?: string
    lat: number
    lng: number
    timestamp?: Date | string
    gpsDeviceId?: string | null
  }

  export type DriverReportUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutReportsNestedInput
  }

  export type DriverReportUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type DriverReportUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    suggestedSeverity?: NullableStringFieldUpdateOperationsInput | string | null
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type PartsExchangeUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driver?: DriverUpdateOneRequiredWithoutPartsExchangesNestedInput
  }

  export type PartsExchangeUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type PartsExchangeUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    partName?: StringFieldUpdateOperationsInput | string
    cost?: FloatFieldUpdateOperationsInput | number
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    photoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    receiptUrl?: NullableStringFieldUpdateOperationsInput | string | null
    reimbursementStatus?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    driverId?: StringFieldUpdateOperationsInput | string
  }

  export type LocationPingUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationPingUncheckedUpdateWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LocationPingUncheckedUpdateManyWithoutVehicleInput = {
    id?: StringFieldUpdateOperationsInput | string
    lat?: FloatFieldUpdateOperationsInput | number
    lng?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    gpsDeviceId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type ChatMessageCreateManyConversationInput = {
    id?: string
    content: string
    mediaUrl?: string | null
    mediaType?: string | null
    createdAt?: Date | string
    read?: boolean
    senderId: string
  }

  export type ChatMessageUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    sender?: DriverUpdateOneRequiredWithoutSentMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderId?: StringFieldUpdateOperationsInput | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutConversationInput = {
    id?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    mediaUrl?: NullableStringFieldUpdateOperationsInput | string | null
    mediaType?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    read?: BoolFieldUpdateOperationsInput | boolean
    senderId?: StringFieldUpdateOperationsInput | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}