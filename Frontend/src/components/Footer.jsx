import React from 'react';
import { Box, Grid, Typography, Link, IconButton } from '@mui/material';
import {  Twitter, Instagram, Language, LinkedIn } from '@mui/icons-material';
import '../styles/Footer.css'; // You can still use custom CSS if needed

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#f8f8f8', padding: '40px 0' }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        {/* Footer Logo and Help Center */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: '#222' }}>
              Hopin
            </Typography>
            <Link href="#" variant="body2" sx={{ display: 'block', marginTop: '8px', color: '#007bff' }}>
              Visit Help Center
            </Link>
          </Grid>

          {/* Footer Sections */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222', marginBottom: '16px' }}>
              Company
            </Typography>
            <Box>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                About us
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Our offerings
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Newsroom
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Investors
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Blog
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Careers
              </Link>
            </Box>
          </Grid>

          {/* Products */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222', marginBottom: '16px' }}>
              Products
            </Typography>
            <Box>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Ride
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Drive
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Deliver
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Eat
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Uber for Business
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Uber Freight
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Gift cards
              </Link>
            </Box>
          </Grid>

          {/* Global Citizenship */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#222', marginBottom: '16px' }}>
              Global citizenship
            </Typography>
            <Box>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Safety
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Diversity and Inclusion
              </Link>
              <Link href="#" variant="body2" sx={{ display: 'block', color: '#555', marginBottom: '8px' }}>
                Sustainability
              </Link>
            </Box>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box sx={{ borderTop: '1px solid #ddd', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <IconButton href="https://www.linkedin.com/in/keshav-sai-321185155/" color="inherit">
              <LinkedIn />
            </IconButton>
            <IconButton href="https://www.linkedin.com/in/keshav-sai-321185155/" color="inherit">
              <Twitter />
            </IconButton>
            <IconButton href="#" color="inherit">
              <Instagram />
            </IconButton>
          </Box>
          <Box>
            <Typography variant="body2" sx={{ color: '#555' }}>
              English | Hyderabd
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
