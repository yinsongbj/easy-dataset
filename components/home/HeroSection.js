'use client';

import { Box, Container, Typography, Button } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { styles } from '@/styles/home';
import { useTheme } from '@mui/material';

export default function HeroSection({ onCreateProject }) {
    const theme = useTheme();

    return (
        <Box sx={{ ...styles.heroSection, ...styles.heroBackground(theme) }}>
            <Box sx={styles.decorativeCircle} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
                    <Typography
                        variant="h2"
                        component="h1"
                        fontWeight="bold"
                        sx={styles.gradientTitle(theme)}
                    >
                        Easy DataSet
                    </Typography>

                    <Typography variant="h5" color="text.secondary" paragraph>
                        简单高效地处理文本、创建问题并生成高质量数据集
                    </Typography>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={onCreateProject}
                        startIcon={<AddCircleOutlineIcon />}
                        sx={styles.createButton(theme)}
                    >
                        创建新项目
                    </Button>
                    <Button
                        variant="contained"
                        size="large"
                        onClick={() => {
                            window.location.href = '/dataset-square'
                        }}
                        startIcon={<SearchIcon />}
                        sx={styles.createButton(theme)}
                        style={{ marginLeft: '24px' }}
                    >
                        搜索公开数据集
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}