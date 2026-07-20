import { useId } from "react";

/** A few garden cuttings in a little hand-glazed ivory vase. */
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
        <g fill="none" stroke="var(--scene-leaf)" strokeWidth="1.25">
          <path d="M316 392C312 371 312 349 307 321" />
          <path d="M318 392C327 373 334 357 329 341" />
          <path d="M316 391C310 373 302 354 293 343" />
          <path d="M317 391C321 367 321 335 328 314" />
          <path d="M319 391Q328 373 336 363M310 377Q306 371 304 366M313 357Q321 350 320 342" />
        </g>
        <path
          d="M317 386Q319 366 321 350M311 365 307 340"
          fill="none"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".5"
          opacity=".7"
        />

        {/* Each blade grows from a visible junction; folded leaves show their reverse. */}
        <g fill={paint("leaf")} stroke="var(--scene-leaf)" strokeWidth=".75">
          <path d="M313 373C300 373 294 361 294 356C305 357 312 363 313 373Z" />
          <path d="M321 372C321 359 331 352 339 351C338 362 329 370 321 372Z" />
          <path d="M310 355C303 349 303 340 305 335C311 340 314 348 310 355Z" />
          <path d="M321 349C319 337 324 330 329 327C332 337 328 345 321 349Z" />
          <path d="M305 366C294 368 287 363 285 358C294 356 302 359 305 366Z" />
          <path d="M326 380C333 371 340 373 343 377C338 382 333 384 326 380Z" />
        </g>
        <path
          d="M313 373Q300 365 294 356Q305 357 313 373ZM321 372Q331 362 339 351Q338 365 321 372Z"
          fill="var(--scene-leaf)"
          stroke="none"
          opacity=".48"
        />
        <g
          fill="none"
          stroke="var(--scene-leaf-light)"
          strokeWidth=".65"
          opacity=".9"
        >
          <path d="M312 372 297 359m8 7-1-5m1 5-5 0M322 371 336 355m-8 9 1-6m-1 6 5-1" />
          <path d="M310 354 306 340M322 347l5-15M303 365l-13-5M328 380l11-3" />
        </g>
        <path
          d="M313 382Q305 382 302 377Q309 375 313 382Z"
          fill="var(--scene-leaf-light)"
          stroke="var(--scene-leaf)"
          strokeWidth=".65"
        />
        <path
          d="M312 382 305 378"
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
            <path d="M-2-1C-6-6-5-13-1-12C3-13 3-5 1-1Z" />
            <path d="M1-2C2-10 7-13 9-9C12-5 6-1 3 1Z" />
            <path d="M2 0C9-5 14-3 12 1C11 5 6 5 2 3Z" />
            <path d="M2 2C10 3 12 8 8 10C4 11 1 6 0 3Z" />
            <path d="M1 3C5 9 2 14-1 12C-5 11-4 7-2 2Z" />
            <path d="M-2 3C-4 10-10 11-11 7C-11 3-6 1-3 0Z" />
            <path d="M-3 1C-11 5-15 0-11-3C-8-5-4-3-1-1Z" />
            <path d="M-2 0C-10-2-12-8-8-9C-4-11-2-6 0-2Z" />
          </g>
          <g
            fill="none"
            stroke="var(--scene-pot)"
            strokeWidth=".45"
            opacity=".55"
          >
            <path d="M-1-5v-5M5-4l2-3M6 1h4M4 5l3 3M-1 6v4M-6 5l-2 1M-6-1-9-2M-4-4-6-7" />
          </g>
          <ellipse
            cy="1"
            rx="4.2"
            ry="3.7"
            fill={paint("pollen")}
            stroke="var(--scene-gold)"
          />
          <path
            d="M-2 0h.2M1-1h.2M2 2h.2M-1 3h.2"
            stroke="var(--scene-wood)"
            strokeWidth=".8"
            opacity=".6"
          />
        </g>

        {/* A turned flower exposes its green calyx and foreshortened back petals. */}
        <g
          transform="translate(330 340) rotate(23)"
          stroke="var(--scene-pot)"
          strokeWidth=".65"
        >
          <path
            d="M-3 3 0 7 3 3 6 1 0 2-5 0Z"
            fill="var(--scene-leaf)"
            stroke="var(--scene-leaf)"
          />
          <g fill={paint("petal")}>
            <path d="M-2 0C-8-5-7-10-3-8Q1-6 1-1Z" />
            <path d="M0-1C1-9 5-11 7-7Q8-3 3 1Z" />
            <path d="M2 0C7-6 12-4 10 0Q8 4 3 3Z" />
            <path d="M-2 0C-10-4-13 0-8 4Q-5 6-1 3Z" />
            <path d="M0 2C-5 5-6 10-2 10Q3 10 3 3Z" />
            <path d="M2 2C8 2 10 7 6 8Q2 8 0 4Z" />
          </g>
          <ellipse
            cy="1"
            rx="4.1"
            ry="2.5"
            fill={paint("pollen")}
            stroke="var(--scene-gold)"
          />
          <path
            d="M-2 0 1 0"
            stroke="var(--scene-paper)"
            strokeWidth=".8"
            opacity=".7"
          />
        </g>

        {/* One nodding bloom and two closed buds give the bouquet a loose outline. */}
        <g
          transform="translate(292 343) rotate(-26)"
          stroke="var(--scene-pot)"
          strokeWidth=".6"
        >
          <path
            d="M-3-2Q-2-7 1-7Q4-5 4-1"
            fill="var(--scene-leaf)"
            stroke="var(--scene-leaf)"
          />
          <path
            d="M-3-2C-10-1-10 7-7 8Q-4 8-2 2C-5 9 0 12 3 8Q5 5 2 0C5 7 9 7 9 3Q9-2 3-3Z"
            fill={paint("petal")}
          />
          <path
            d="M-2 0q3-3 6 0"
            fill="none"
            stroke="var(--scene-gold)"
            strokeWidth="1.8"
          />
          <path
            d="M0 3v4M-6 3l-1 2"
            strokeWidth=".45"
            fill="none"
            opacity=".6"
          />
        </g>
        <g transform="translate(328 313) rotate(18)">
          <path
            d="M0 4C-7 1-5-7-1-7C4-9 7-2 3 2Z"
            fill={paint("petal")}
            stroke="var(--scene-pot)"
            strokeWidth=".65"
          />
          <path
            d="M0 4-4-1 0 1 2-4 3 1 6-2Q6 3 0 4Z"
            fill="var(--scene-leaf)"
            stroke="var(--scene-leaf)"
            strokeWidth=".6"
          />
          <path d="M-1-5 0-1" stroke="var(--scene-paper)" strokeWidth="1" />
        </g>
        <g transform="translate(338 360) rotate(38)">
          <path
            d="M0 4C-6 1-5-6-1-6Q5-5 4 0Z"
            fill="color-mix(in srgb, var(--scene-rose) 45%, var(--scene-paper))"
            stroke="var(--scene-pot)"
            strokeWidth=".6"
          />
          <path
            d="M0 4-4 0 0 1 3-2 4 1Z"
            fill="var(--scene-leaf)"
            stroke="var(--scene-leaf)"
            strokeWidth=".6"
          />
        </g>
      </g>

      {/* The pear-shaped body covers the cut stem ends beneath the front lip. */}
      <path
        d="M308 389Q317 393 326 389L324 399C324 404 334 409 336 418Q339 430 325 433Q317 436 308 432C298 428 299 417 304 410Q311 401 308 389Z"
        fill={paint("glaze")}
        stroke="var(--scene-pot)"
        strokeWidth="1.1"
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

      {/* A restrained, slightly uneven painted sprig sits beneath the glaze. */}
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
      <path
        d="M315 409q-1-2 1-3q3 0 2 3Z"
        fill="var(--scene-rose)"
        stroke="none"
        opacity=".62"
      />
    </g>
  );
}
