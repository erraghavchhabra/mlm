"use client";

interface TreeConnectorProps {
  width?: number;
  height?: number;
}

export default function TreeConnector({
  width = 300,
  height = 70,
}: TreeConnectorProps) {
  const center = width / 2;
  const left = 40;
  const right = width - 40;
  const middleY = 26;

  return (
    <svg
      width={width}
      height={height}
      className="overflow-visible"
    >
      <defs>
        <linearGradient
          id="connectorGradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" stopColor="#6F7DFF" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#6F7DFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#6F7DFF" stopOpacity="0.15" />
        </linearGradient>

        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Parent */}
      <path
        d={`M ${center} 0 V ${middleY}`}
        stroke="#4B57B8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Horizontal */}
      <path
        d={`M ${left} ${middleY}
            C ${left + 15} ${middleY},
              ${left + 15} ${middleY},
              ${left + 30} ${middleY}

            H ${right - 30}

            C ${right - 15} ${middleY},
              ${right - 15} ${middleY},
              ${right} ${middleY}`}
        stroke="url(#connectorGradient)"
        strokeWidth="2"
        fill="none"
        filter="url(#glow)"
        strokeLinecap="round"
      />

      {/* Left */}
      <path
        d={`M ${left} ${middleY}
            V ${height}`}
        stroke="#4B57B8"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Right */}
      <path
        d={`M ${right} ${middleY}
            V ${height}`}
        stroke="#4B57B8"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}