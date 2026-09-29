import { useId } from "react";
import { NookThread } from "./NookThread";
import { resewnFoliagePath } from "./nookFoliageModels";
import "./nook-foliage-models.css";

const stems =
  "M316 392C312 371 312 349 307 321M318 392C327 373 334 357 329 341M316 391C310 373 302 354 293 343M317 391C321 367 321 335 328 314M319 391Q328 373 336 363M310 377Q306 371 304 366M313 357Q321 350 320 342";

function PollenKnots({
  flattened = false,
  model = 0,
}: {
  flattened?: boolean;
  model?: number;
}) {
  return (
    <g transform={flattened ? "translate(0 .4) scale(1 .65)" : undefined}>
      {[
        [-2, 0],
        [0, -1],
        [2, 0.5],
        [-1, 2.2],
        [1.4, 2.5],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          <NookThread
            d={
              [
                "M-.7 .3C-1.1-.9 .7-1.3 .9-.2C1.1.8-.3 1-.4.2",
                "M-.8 .4C-1.3-.6 .6-1.4 1-.3C1.3.6-.2 1.2-.5.3",
                "M-.6 .2C-.9-1.1 .9-1 .8 0C.8 1-.5.9-.3.1",
              ][model]
            }
            color="var(--scene-gold)"
            highlight="var(--scene-paper)"
            shadow="var(--scene-wood)"
            width={1.2}
          />
        </g>
      ))}
    </g>
  );
}

/** Garden cuttings worked in fishbone stitch, with a padded ivory vase. */
export function NookPlant() {
  const id = useId().replace(/:/g, "");
  const paint = (name: string) => `url(#${id}-plant-${name})`;

  return (
    <g
      className="nook-plant"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth=".9"
    >
      <defs>
        <linearGradient
          id={`${id}-plant-glaze`}
          x1="0"
          y1=".15"
          x2="1"
          y2=".45"
        >
          <stop stopColor="var(--scene-pot)" />
          <stop offset=".2" stopColor="var(--scene-paper)" />
          <stop offset=".5" stopColor="var(--scene-paper)" />
          <stop
            offset=".84"
            stopColor="color-mix(in srgb, var(--scene-paper) 62%, var(--scene-pot))"
          />
          <stop offset="1" stopColor="var(--scene-pot)" />
        </linearGradient>
        <linearGradient id={`${id}-plant-petal`} x1=".2" y1="0" x2=".7" y2="1">
          <stop stopColor="var(--scene-paper)" />
          <stop offset=".6" stopColor="var(--scene-paper)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-paper) 72%, var(--scene-pot))"
          />
        </linearGradient>
        <radialGradient id={`${id}-plant-pollen`} cx=".3" cy=".24" r=".8">
          <stop stopColor="color-mix(in srgb, var(--scene-gold) 65%, var(--scene-paper))" />
          <stop offset=".6" stopColor="var(--scene-gold)" />
          <stop offset="1" stopColor="var(--scene-wood)" />
        </radialGradient>
        <linearGradient id={`${id}-plant-leaf`} x2=".85" y2="1">
          <stop stopColor="var(--scene-leaf-light)" />
          <stop offset=".6" stopColor="var(--scene-leaf)" />
          <stop
            offset="1"
            stopColor="color-mix(in srgb, var(--scene-leaf) 82%, var(--scene-wood-dark))"
          />
        </linearGradient>
      </defs>

      <ellipse
        cx="317"
        cy="434"
        rx="22"
        ry="2.7"
        fill="var(--scene-shadow)"
        stroke="none"
        opacity=".17"
      />
      <ellipse
        cx="317"
        cy="434"
        rx="12"
        ry="1.2"
        fill="var(--scene-shadow)"
        stroke="none"
        opacity=".22"
      />

      {/* The back of the mouth is behind the stems; its front lip is painted last. */}
      <ellipse cx="317" cy="389" rx="9" ry="3.2" fill={paint("glaze")} />
      <ellipse
        cx="317"
        cy="389"
        rx="6.7"
        ry="1.8"
        fill="var(--scene-wood-dark)"
        stroke="none"
      />
      <g className="nook-posy">
        <NookThread
          d={stems}
          color="var(--scene-leaf)"
          highlight="var(--scene-leaf-light)"
          width={1.65}
        />
        <path
          d={stems}
          fill="none"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".9"
          strokeDasharray=".7 3"
        />
        <path
          d="M317 386Q319 366 321 350M311 365 307 340"
          fill="none"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".5"
          opacity=".7"
        />

        {[0, 1, 2].map((model) => (
          <g
            key={model}
            data-sewn-model={model}
            className={`nook-foliage-model nook-foliage-model--${model}`}
          >
            {/* Each blade grows from a visible junction; folded leaves show their reverse. */}
            <g
              fill={paint("leaf")}
              stroke="var(--scene-leaf)"
              strokeWidth=".75"
            >
              <path
                d={resewnFoliagePath(
                  "M313 373C300 373 294 361 294 356C305 357 312 363 313 373Z",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M321 372C321 359 331 352 339 351C338 362 329 370 321 372Z",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M310 355C303 349 303 340 305 335C311 340 314 348 310 355Z",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M321 349C319 337 324 330 329 327C332 337 328 345 321 349Z",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M305 366C294 368 287 363 285 358C294 356 302 359 305 366Z",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M326 380C333 371 340 373 343 377C338 382 333 384 326 380Z",
                  model,
                  5,
                )}
              />
            </g>
            <path
              d={resewnFoliagePath(
                "M313 373Q300 365 294 356Q305 357 313 373ZM321 372Q331 362 339 351Q338 365 321 372Z",
                model,
                5,
              )}
              fill="var(--scene-leaf)"
              stroke="none"
              opacity=".48"
            />
            <NookThread
              d={resewnFoliagePath(
                "M298 359 298 363M301 360 300 365M304 362 303 368M307 365 306 370M310 368 309 371M296 362 301 362M298 366 304 365M301 369 307 368M305 372 310 371M335 354 334 359M332 355 331 363M329 358 328 366M326 361 325 369M337 358 332 359M334 362 329 362M331 366 326 366M327 369 324 368M305 340 308 342M305 344 309 346M306 348 310 350M309 341 307 345M311 345 308 348M310 351 308 352M327 331 324 335M328 335 323 339M327 339 322 343M324 333 325 336M322 337 325 340M321 341 323 344M289 360 293 362M292 359 295 363M296 360 299 364M300 362 302 365M291 364 293 361M295 366 297 363M299 366 301 364M330 378 332 380M333 376 335 379M337 376 338 378M333 381 334 378M337 380 338 377",
                model,
                5,
              )}
              color="var(--scene-leaf-light)"
              highlight="color-mix(in srgb, var(--scene-leaf-light) 80%, var(--scene-paper))"
              shadow="var(--scene-leaf)"
              width={1.05}
            />
            <g
              fill="none"
              stroke="var(--scene-leaf-light)"
              strokeWidth=".65"
              opacity=".9"
            >
              <path
                d={resewnFoliagePath(
                  "M312 372 297 359m8 7-1-5m1 5-5 0M322 371 336 355m-8 9 1-6m-1 6 5-1",
                  model,
                  5,
                )}
              />
              <path
                d={resewnFoliagePath(
                  "M310 354 306 340M322 347l5-15M303 365l-13-5M328 380l11-3",
                  model,
                  5,
                )}
              />
            </g>
            <path
              d={resewnFoliagePath(
                "M313 382Q305 382 302 377Q309 375 313 382Z",
                model,
                5,
              )}
              fill="var(--scene-leaf-light)"
              stroke="var(--scene-leaf)"
              strokeWidth=".65"
            />
            <path
              d={resewnFoliagePath("M312 382 305 378", model, 5)}
              stroke="var(--scene-leaf)"
              strokeWidth=".5"
            />

            {/* An open daisy: irregular overlapping petals, rather than a radial stamp. */}
            <g
              transform="translate(307 318) rotate(-9)"
              stroke="var(--scene-pot)"
              strokeWidth=".65"
            >
              <g fill={paint("petal")}>
                <path
                  d={resewnFoliagePath(
                    "M-2-1C-6-6-5-13-1-12C3-13 3-5 1-1Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M1-2C2-10 7-13 9-9C12-5 6-1 3 1Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M2 0C9-5 14-3 12 1C11 5 6 5 2 3Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M2 2C10 3 12 8 8 10C4 11 1 6 0 3Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M1 3C5 9 2 14-1 12C-5 11-4 7-2 2Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M-2 3C-4 10-10 11-11 7C-11 3-6 1-3 0Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M-3 1C-11 5-15 0-11-3C-8-5-4-3-1-1Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M-2 0C-10-2-12-8-8-9C-4-11-2-6 0-2Z",
                    model,
                    5,
                  )}
                />
              </g>
              <NookThread
                d={resewnFoliagePath(
                  "M-2-4Q-4-8-2-11M0-4Q1-8 0-11M3-3 6-9M5-2 8-8M5 0 11-1M5 2 10 2M3 4 8 7M2 6 6 9M0 5 1 11M-2 5-2 10M-4 3-9 6M-4 5-8 8M-5 0-11 0M-5-2-10-2M-3-3-8-7M-2-5-6-8",
                  model,
                  5,
                )}
                color="var(--scene-paper)"
                shadow="var(--scene-pot)"
                highlight="var(--scene-paper)"
                width={1.45}
              />
              <ellipse
                cy="1"
                rx="4.2"
                ry="3.7"
                fill={paint("pollen")}
                stroke="var(--scene-gold)"
              />
              <PollenKnots model={model} />
            </g>

            {/* A turned flower exposes its green calyx and foreshortened back petals. */}
            <g
              transform="translate(330 340) rotate(23)"
              stroke="var(--scene-pot)"
              strokeWidth=".65"
            >
              <path
                d={resewnFoliagePath("M-3 3 0 7 3 3 6 1 0 2-5 0Z", model, 5)}
                fill="var(--scene-leaf)"
                stroke="var(--scene-leaf)"
              />
              <g fill={paint("petal")}>
                <path
                  d={resewnFoliagePath(
                    "M-2 0C-8-5-7-10-3-8Q1-6 1-1Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath("M0-1C1-9 5-11 7-7Q8-3 3 1Z", model, 5)}
                />
                <path
                  d={resewnFoliagePath("M2 0C7-6 12-4 10 0Q8 4 3 3Z", model, 5)}
                />
                <path
                  d={resewnFoliagePath(
                    "M-2 0C-10-4-13 0-8 4Q-5 6-1 3Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath(
                    "M0 2C-5 5-6 10-2 10Q3 10 3 3Z",
                    model,
                    5,
                  )}
                />
                <path
                  d={resewnFoliagePath("M2 2C8 2 10 7 6 8Q2 8 0 4Z", model, 5)}
                />
              </g>
              <NookThread
                d={resewnFoliagePath(
                  "M-2-2-4-7M-1-3-2-7M1-3 4-8M3-2 6-7M4 0 9-2M5 2 9 0M-4 1-9 0M-4 3-8 3M-1 4-3 8M1 4 0 9M3 4 6 6M2 5 5 7",
                  model,
                  5,
                )}
                color="var(--scene-paper)"
                shadow="var(--scene-pot)"
                highlight="var(--scene-paper)"
                width={1.35}
              />
              <ellipse
                cy="1"
                rx="4.1"
                ry="2.5"
                fill={paint("pollen")}
                stroke="var(--scene-gold)"
              />
              <PollenKnots flattened model={model} />
            </g>

            {/* One nodding bloom and two closed buds give the bouquet a loose outline. */}
            <g
              transform="translate(292 343) rotate(-26)"
              stroke="var(--scene-pot)"
              strokeWidth=".6"
            >
              <path
                d={resewnFoliagePath("M-3-2Q-2-7 1-7Q4-5 4-1", model, 5)}
                fill="var(--scene-leaf)"
                stroke="var(--scene-leaf)"
              />
              <path
                d={resewnFoliagePath(
                  "M-3-2C-10-1-10 7-7 8Q-4 8-2 2C-5 9 0 12 3 8Q5 5 2 0C5 7 9 7 9 3Q9-2 3-3Z",
                  model,
                  5,
                )}
                fill={paint("petal")}
              />
              <path
                d={resewnFoliagePath("M-2 0q3-3 6 0", model, 5)}
                fill="none"
                stroke="var(--scene-gold)"
                strokeWidth="1.8"
              />
              <NookThread
                d={resewnFoliagePath(
                  "M-5 1Q-8 3-7 6M-3 1-5 7M-1 2Q-2 6 0 8M1 2 2 7M4 0 6 5M6 0 8 3",
                  model,
                  5,
                )}
                color="var(--scene-paper)"
                shadow="var(--scene-pot)"
                width={1.4}
              />
            </g>
            <g transform="translate(328 313) rotate(18)">
              <path
                d={resewnFoliagePath(
                  "M0 4C-7 1-5-7-1-7C4-9 7-2 3 2Z",
                  model,
                  5,
                )}
                fill={paint("petal")}
                stroke="var(--scene-pot)"
                strokeWidth=".65"
              />
              <path
                d={resewnFoliagePath(
                  "M0 4-4-1 0 1 2-4 3 1 6-2Q6 3 0 4Z",
                  model,
                  5,
                )}
                fill="var(--scene-leaf)"
                stroke="var(--scene-leaf)"
                strokeWidth=".6"
              />
              <NookThread
                d={resewnFoliagePath(
                  "M-3-4-1 0M-1-6 1-1M1-6 3-1M3-4 4-1",
                  model,
                  5,
                )}
                color="var(--scene-paper)"
                shadow="var(--scene-pot)"
                width={1.3}
              />
            </g>
            <g transform="translate(338 360) rotate(38)">
              <path
                d={resewnFoliagePath("M0 4C-6 1-5-6-1-6Q5-5 4 0Z", model, 5)}
                fill="color-mix(in srgb, var(--scene-rose) 45%, var(--scene-paper))"
                stroke="var(--scene-pot)"
                strokeWidth=".6"
              />
              <path
                d={resewnFoliagePath("M0 4-4 0 0 1 3-2 4 1Z", model, 5)}
                fill="var(--scene-leaf)"
                stroke="var(--scene-leaf)"
                strokeWidth=".6"
              />
              <NookThread
                d={resewnFoliagePath("M-3-3-1 0M-1-5 1-1M1-4 3-1", model, 5)}
                color="var(--scene-rose)"
                shadow="var(--scene-pot)"
                width={1.2}
              />
            </g>
          </g>
        ))}
      </g>

      {/* The pear-shaped body covers the cut stem ends beneath the front lip. */}
      <path
        d="M308 389Q317 393 326 389L324 399C324 404 334 409 336 418Q339 430 325 433Q317 436 308 432C298 428 299 417 304 410Q311 401 308 389Z"
        fill={paint("glaze")}
        stroke="var(--scene-pot)"
        strokeWidth="1.1"
      />
      <NookThread
        d="M309.5 393Q317 396 324.8 392.5M310 395.8Q317 398.8 324.2 395.3M310 398.6Q317 401.4 323.6 398.1M309.7 401.4Q317 404 324 400.9M308.5 404.1Q317 407 325.5 403.8M306.8 406.8Q317 410 328 406.7M304.9 409.5Q317 413 330.5 409.5M303.3 412.2Q317 416.2 332.6 412.2M302.2 415Q317 419.2 334 415M301.8 417.8Q317 422.4 334.7 417.8M301.8 420.6Q317 425.4 335 420.6M302.3 423.4Q317 428 334.6 423.4M303.5 426.2Q317 430.7 333.5 426.2M306 429Q317 433 331 429M309 431.3Q317 434 327.5 431.4"
        color="color-mix(in srgb, var(--scene-paper) 87%, var(--scene-pot))"
        shadow="var(--scene-pot)"
        highlight="var(--scene-paper)"
        width={1.7}
      />
      <NookThread
        d="M308 389Q317 393 326 389L324 399C324 404 334 409 336 418Q339 430 325 433Q317 436 308 432C298 428 299 417 304 410Q311 401 308 389Z"
        color="var(--scene-pot)"
        highlight="var(--scene-paper)"
        width={1.35}
        dasharray="1.1 2"
      />
      <path
        d="M308 389Q317 394 326 389"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="1.6"
      />
      <path
        d="M309 391Q317 394 325 391"
        fill="none"
        stroke="var(--scene-pot)"
        strokeWidth=".65"
      />
      <path
        d="M307 409Q302 416 305 423M312 396l1 5"
        fill="none"
        stroke="var(--scene-paper)"
        strokeWidth="2.3"
        opacity=".7"
      />
      <path
        d="M330 413Q338 425 326 430"
        fill="none"
        stroke="var(--scene-pot)"
        strokeWidth="1.2"
        opacity=".34"
      />
      <path
        d="M307 431Q317 434 327 431L326 434Q317 437 308 434Z"
        fill="color-mix(in srgb, var(--scene-paper) 70%, var(--scene-pot))"
        stroke="var(--scene-pot)"
        strokeWidth=".75"
      />
      <path
        d="M311 432Q318 434 324 432"
        stroke="var(--scene-paper)"
        strokeWidth=".7"
        opacity=".75"
      />

      {/* A second color of floss embroiders a tiny sprig into the vase patch. */}
      <g stroke="var(--scene-leaf)" strokeWidth=".65" opacity=".7">
        <path d="M316 426Q319 418 316 412" fill="none" />
        <path
          d="M317 422Q311 422 312 417Q316 418 317 422ZM318 418Q321 413 325 415Q323 420 318 418Z"
          fill="var(--scene-leaf-light)"
        />
        <path
          d="M316 414Q311 412 313 409Q317 410 316 414Z"
          fill="var(--scene-leaf-light)"
        />
      </g>
      <NookThread
        d="M316 426Q319 418 316 412M313 418 316 421M321 416 319 418M313 410 315 413"
        color="var(--scene-leaf)"
        highlight="var(--scene-leaf-light)"
        width={1.2}
      />
      <path
        d="M315 409q-1-2 1-3q3 0 2 3Z"
        fill="var(--scene-rose)"
        stroke="none"
        opacity=".62"
      />
    </g>
  );
}
