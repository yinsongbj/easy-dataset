'use client';

import React from 'react';
import { Box, TextField, Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useTheme } from '@mui/material/styles';
import { playgroundStyles } from '@/styles/playground';

const MessageInput = ({ 
  userInput, 
  handleInputChange, 
  handleSendMessage, 
  loading, 
  selectedModels 
}) => {
  const theme = useTheme();
  const styles = playgroundStyles(theme);
  
  const isDisabled = Object.values(loading).some(value => value) || selectedModels.length === 0;
  const isSendDisabled = isDisabled || !userInput.trim();
  
  return (
    <Box sx={styles.inputContainer}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="输入消息..."
        value={userInput}
        onChange={handleInputChange}
        disabled={isDisabled}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
        multiline
        maxRows={4}
      />
      <Button
        variant="contained"
        color="primary"
        endIcon={<SendIcon />}
        onClick={handleSendMessage}
        disabled={isSendDisabled}
        sx={styles.sendButton}
      >
        发送
      </Button>
    </Box>
  );
};

export default MessageInput;
