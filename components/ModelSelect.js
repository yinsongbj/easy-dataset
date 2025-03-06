'use client';

import React from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  useTheme
} from '@mui/material';

export default function ModelSelect({ models = [], selectedModel, onChange, size = "small", minWidth = 180 }) {
  const theme = useTheme();

  const handleModelChange = (event) => {
    if (!event || !event.target) return;
    const newModelId = event.target.value;

    // 找到选中的模型对象
    const selectedModelObj = models.find(model => model.id === newModelId);

    if (selectedModelObj) {
      // 将完整的模型信息存储到 localStorage
      localStorage.setItem('selectedModelId', newModelId);
      localStorage.setItem('selectedModelInfo', JSON.stringify(selectedModelObj));
    } else {
      // 如果没有找到对应模型，则只存储ID
      localStorage.setItem('selectedModelId', newModelId);
      localStorage.removeItem('selectedModelInfo');
    }

    // 通知父组件
    onChange?.(event);
  };

  return (
    <FormControl size={size} sx={{ minWidth }}>
      <Select
        value={selectedModel}
        onChange={handleModelChange}
        displayEmpty
        variant="outlined"
        sx={{
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.15)',
          color: theme.palette.mode === 'dark' ? 'inherit' : 'white',
          borderRadius: '8px',
          '& .MuiSelect-icon': {
            color: theme.palette.mode === 'dark' ? 'inherit' : 'white'
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent'
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'transparent'
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'primary.main'
          }
        }}
        MenuProps={{
          PaperProps: {
            elevation: 2,
            sx: { mt: 1, borderRadius: 2 }
          }
        }}
      >
        <MenuItem value="" disabled>
          选择模型
        </MenuItem>
        {models.map((model) => (
          <MenuItem key={model.id} value={model.id}>
            {model.provider}: {model.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}