// ExportDatasetDialog.js 组件
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    TextField,
    Checkbox,
    Typography,
    Box,
    Paper,
    useTheme
} from '@mui/material';

const ExportDatasetDialog = ({ open, onClose, onExport }) => {
    const theme = useTheme();
    const [formatType, setFormatType] = useState('alpaca');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [confirmedOnly, setConfirmedOnly] = useState(true);
    const [fileFormat, setFileFormat] = useState('json');

    const handleFileFormatChange = (event) => {
        setFileFormat(event.target.value);
    };

    const handleFormatChange = (event) => {
        setFormatType(event.target.value);
    };

    const handleSystemPromptChange = (event) => {
        setSystemPrompt(event.target.value);
    };

    const handleConfirmedOnlyChange = (event) => {
        setConfirmedOnly(event.target.checked);
    };

    const handleExport = () => {
        onExport({
            formatType,
            systemPrompt,
            confirmedOnly,
            fileFormat
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>导出数据集</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        文件格式
                    </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="fileFormat"
                            name="fileFormat"
                            value={fileFormat}
                            onChange={handleFileFormatChange}
                            row
                        >
                            <FormControlLabel value="json" control={<Radio />} label="JSON" />
                            <FormControlLabel value="jsonl" control={<Radio />} label="JSONL" />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        数据集风格
                    </Typography>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label="format"
                            name="format"
                            value={formatType}
                            onChange={handleFormatChange}
                            row
                        >
                            <FormControlLabel value="alpaca" control={<Radio />} label="Alpaca 格式" />
                            <FormControlLabel value="sharegpt" control={<Radio />} label="ShareGPT 格式" />
                        </RadioGroup>
                    </FormControl>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        格式示例
                    </Typography>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            backgroundColor: theme.palette.mode === 'dark'
                                ? theme.palette.grey[900]
                                : theme.palette.grey[100],
                            overflowX: 'auto'
                        }}
                    >
                        <pre style={{ margin: 0 }}>
                            {formatType === 'alpaca'
                                ? (fileFormat === 'json'
                                    ? JSON.stringify([
                                        {
                                            "instruction": "人类指令（必填）",  // 映射到 question 字段
                                            "input": "人类输入（选填）",
                                            "output": "模型回答（必填）", // 映射到 cot+answer 字段
                                            "system": "系统提示词（选填）"
                                        }
                                    ], null, 2)
                                    : '{"instruction": "人类指令（必填）", "input": "人类输入（选填）", "output": "模型回答（必填）", "system": "系统提示词（选填）"}\n{"instruction": "第二个指令", "input": "", "output": "第二个回答", "system": "系统提示词"}')
                                : (fileFormat === 'json'
                                    ? JSON.stringify([
                                        {
                                            "messages": [
                                                {
                                                    "role": "system",
                                                    "content": "系统提示词（选填）"
                                                },
                                                {
                                                    "role": "user",
                                                    "content": "人类指令" // 映射到 question 字段
                                                },
                                                {
                                                    "role": "assistant",
                                                    "content": "模型回答" // 映射到 cot+answer 字段
                                                }
                                            ]
                                        }
                                    ], null, 2)
                                    : '{"messages": [{"role": "system", "content": "系统提示词（选填）"}, {"role": "user", "content": "人类指令"}, {"role": "assistant", "content": "模型回答"}]}\n{"messages": [{"role": "user", "content": "第二个问题"}, {"role": "assistant", "content": "第二个回答"}]}')
                            }
                        </pre>
                    </Paper>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                        系统提示词（选填）
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        placeholder="请输入系统提示词..."
                        value={systemPrompt}
                        onChange={handleSystemPromptChange}
                    />
                </Box>

                <Box>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={confirmedOnly}
                                onChange={handleConfirmedOnlyChange}
                            />
                        }
                        label="只导出已确认的数据集"
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
                <Button onClick={handleExport} variant="contained" color="primary">
                    确认导出
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ExportDatasetDialog;