"use client";

import React, { useState } from 'react';
import { AppBar, Toolbar, Container, Box, Button, Typography } from '@mui/material';
import { Zap } from 'lucide-react';
import NetworkSwitcher from './NetworkSwitcher';
import OneChainWalletButton from './OneChainWalletButton';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [showVRFModal] = useState(false); // Placeholder retained to avoid layout changes
  const { t, i18n } = useTranslation();

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(10px)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
                {t('navbar.title')}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                sx={{ color: 'white', borderColor: 'white' }}
                onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'zh' : 'en')}
              >
                {i18n.language === 'en' ? 'ZH' : 'EN'}
              </Button>
              <OneChainWalletButton />
              <NetworkSwitcher />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* VRF Modal placeholder removed */}
    </>
  );
};

export default Navbar;