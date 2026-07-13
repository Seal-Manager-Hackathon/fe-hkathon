export default function TabPlaceholder({ label, icon: Icon = null, accent = '#1565c0' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        gap: 16,
        color: '#666',
      }}
    >
      {Icon && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: accent + '14',
            color: accent,
          }}
        >
          <Icon size={28} />
        </div>
      )}
      <span style={{ fontSize: 15, fontWeight: 500, color: '#333' }}>
        {label}
      </span>
      <span style={{ fontSize: 13, color: '#999' }}>Coming soon</span>
    </div>
  );
}
