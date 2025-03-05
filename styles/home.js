// styles/home.js
export const styles = {
    heroSection: {
        pt: 8,
        pb: 6,
        position: 'relative',
        overflow: 'hidden'
    },
    heroBackground: (theme) => ({
        background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, rgba(42, 92, 170, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(42, 92, 170, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)'
    }),
    decorativeCircle: {
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(42, 92, 170, 0) 70%)',
        top: '-200px',
        right: '-100px',
        zIndex: 0
    },
    gradientTitle: (theme) => ({
        mb: 2,
        background: theme.palette.gradient.primary,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        textFillColor: 'transparent'
    }),
    createButton: (theme) => ({
        mt: 3,
        px: 4,
        py: 1.2,
        borderRadius: '12px',
        fontSize: '1rem',
        background: theme.palette.gradient.primary,
        '&:hover': {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
        }
    }),
    statsCard: (theme) => ({
        mt: 6,
        p: { xs: 2, md: 4 },
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0, 0, 0, 0.2)'
            : '0 8px 24px rgba(0, 0, 0, 0.05)',
        background: theme.palette.mode === 'dark'
            ? 'rgba(30, 30, 30, 0.6)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(8px)'
    }),
    projectCard: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'visible',
        position: 'relative'
    },
    projectAvatar: {
        position: 'absolute',
        top: -16,
        left: 24,
        zIndex: 1
    },
    projectDescription: {
        mb: 2,
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        height: '40px'
    }
};