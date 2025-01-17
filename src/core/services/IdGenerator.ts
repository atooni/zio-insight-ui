import * as Ctx from "@effect/data/Context"
import * as C from "@effect/io/Clock"
import * as T from "@effect/io/Effect"
import * as L from "@effect/io/Layer"
import * as Ref from "@effect/io/Ref"

import * as Log from "@core/services/Logger"

/**
 * A simple ID generator to generate unique strings within the application,
 * can be used to generated distinguished keys for anything that needs to be
 * distinguished.
 */
export interface IdGenerator {
  readonly nextId: (_: string) => T.Effect<never, never, string>
}

export const IdGenerator = Ctx.Tag<IdGenerator>()

function make(
  log: Log.LogService,
  sem: T.Semaphore,
  lastTS: Ref.Ref<number>,
  cnt: Ref.Ref<number>
) {
  // make sure the key generator runs atomically
  const update = (prefix: string) =>
    sem.withPermits(1)(
      T.gen(function* ($) {
        const now = yield* $(C.currentTimeMillis())
        const curr = yield* $(Ref.getAndSet(lastTS, now))
        if (curr == now) {
          yield* $(Ref.update(cnt, (c) => c + 1))
        } else {
          yield* $(Ref.set(cnt, 1))
        }
        const next = yield* $(Ref.get(cnt))
        const res = `${prefix}-${now}-${next}`
        yield* $(log.debug(`Generated Id: <${res}>`))
        return res
      })
    )

  return T.sync(() => {
    return {
      nextId: (prefix: string) => update(prefix),
    } as IdGenerator
  })
}

export const live = L.effect(
  IdGenerator,
  T.gen(function* ($) {
    const now = yield* $(C.currentTimeMillis())
    const log = yield* $(T.service(Log.LogService))
    const sem = yield* $(T.makeSemaphore(1))
    const ts = yield* $(Ref.make(now))
    const cnt = yield* $(Ref.make(0))
    return yield* $(make(log, sem, ts, cnt))
  })
)

export const nextId = (prefix: string) =>
  T.serviceWithEffect(IdGenerator, (svc) => svc.nextId(prefix))
