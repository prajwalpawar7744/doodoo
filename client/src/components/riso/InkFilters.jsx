// SVG filters shared by every printed element. Render once per page.
function InkFilters() {
  return (
    <svg aria-hidden="true" className="absolute size-0">
      <defs>
        {/* Roughened edges + uneven ink coverage */}
        <filter id="ink" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="1" seed="8" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.15" result="speck" />
          <feComposite in="rough" in2="speck" operator="in" />
        </filter>

        {/* Same ink, scaled down for small type */}
        <filter id="ink-fine" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.09" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="rough" />
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="8" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2 2.1" result="speck" />
          <feComposite in="rough" in2="speck" operator="in" />
        </filter>

        {/* Edges only, for thin strokes where speckle would break the line */}
        <filter id="ink-edge" x="-10%" y="-20%" width="120%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="5" result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="3" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
    </svg>
  )
}

export default InkFilters
