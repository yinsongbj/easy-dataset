'use client';

import React from 'react';
import { Grid, Button, Divider, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTheme } from '@mui/material/styles';
import ModelSelector from './ModelSelector';
import { playgroundStyles } from '@/styles/playground';

const PlaygroundHeader = ({ 
  availableModels, 
  selectedModels, 
  handleModelSelection, 
  handleClearConversations, 
  conversations,
  outputMode,
  handleOutputModeChange
}) => {
  const theme = useTheme();
  const styles = playgroundStyles(theme);
  
  const isClearDisabled = selectedModels.length === 0 || 
    Object.values(conversations).every(conv => conv.length === 0);
  
  return (
    <>
      <Grid container spacing={2} sx={styles.controlsContainer}>
        <Grid item xs={12} md={6}>
          <ModelSelector 
            models={availableModels} 
            selectedModels={selectedModels} 
            onChange={handleModelSelection} 
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel id="output-mode-label">输出方式</InputLabel>
            <Select
              labelId="output-mode-label"
              id="output-mode-select"
              value={outputMode}
              label="输出方式"
              onChange={handleOutputModeChange}
            >
              <MenuItem value="normal">普通输出</MenuItem>
              <MenuItem value="streaming">流式输出</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={handleClearConversations}
            disabled={isClearDisabled}
            sx={styles.clearButton}
          >
            清空对话
          </Button>
        </Grid>
      </Grid>
      
      <Divider sx={styles.divider} />
    </>
  );
};

export default PlaygroundHeader;
