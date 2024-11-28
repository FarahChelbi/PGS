document.addEventListener('DOMContentLoaded', () => {
    // Gestionnaire de soumission pour le formulaire d'inscription
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mdp: password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Inscription réussie !');
                document.getElementById('register-form').reset();
            } else {
                alert(result.error || 'Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            alert('Erreur lors de l\'inscription');
        }
    });

    // Gestionnaire de soumission pour le formulaire de connexion
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, mdp: password }),
            });

            const result = await response.json();

            if (response.ok) {
                alert('Connexion réussie !');
                window.location.href = '/users'; // Redirection après connexion réussie
            } else {
                alert(result.error || 'Erreur lors de la connexion');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            alert('Erreur lors de la connexion');
        }
    });
});
