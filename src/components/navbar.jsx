export default function Navbar() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>MemeApp</div>
      <div style={styles.links}>
        <button onClick={handleLogout} style={styles.logoutButton}>Cerrar sesión</button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#333',
    color: 'white',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontWeight: 'bold',
    fontSize: '1.2rem',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '500',
  },
  logoutButton: {
    padding: '0.4rem 0.8rem',
    background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};
