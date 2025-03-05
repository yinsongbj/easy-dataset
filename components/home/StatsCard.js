'use client';

import { Paper, Grid, Box, Typography } from '@mui/material';
import { styles } from '@/styles/home';
import { useTheme } from '@mui/material';

// 默认模型列表
const mockModels = [
    { id: 'deepseek-r1', provider: 'Ollama', name: 'DeepSeek-R1' },
    { id: 'gpt-3.5-turbo-openai', provider: 'OpenAI', name: 'gpt-3.5-turbo' },
    { id: 'gpt-3.5-turbo-guiji', provider: '硅基流动', name: 'gpt-3.5-turbo' },
    { id: 'glm-4-flash', provider: '智谱AI', name: 'GLM-4-Flash' }
];

export default function StatsCard({ projects }) {
    const theme = useTheme();

    return (
        <Paper elevation={0} sx={styles.statsCard(theme)}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography color="primary" variant="h2" fontWeight="bold">
                            {projects.length}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            进行中的项目
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography color="secondary" variant="h2" fontWeight="bold">
                            {projects.reduce((sum, project) => sum + (project.questionsCount || 0), 0)}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            问题数量
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography sx={{ color: theme.palette.success.main }} variant="h2" fontWeight="bold">
                            {projects.reduce((sum, project) => sum + (project.datasetsCount || 0), 0)}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            生成的数据集
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Box textAlign="center">
                        <Typography sx={{ color: theme.palette.warning.main }} variant="h2" fontWeight="bold">
                            {mockModels.length}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            支持的模型
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}