import React from 'react';
import { Stack, IconButton, Button, Typography, useTheme, Box, BoxProps } from '@mui/material';
// import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
// import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { NavigateBefore, NavigateNext } from '@mui/icons-material';

interface CustomPaginationProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (newPage: number) => void;
  siblingCount?: number;
  sx?: BoxProps['sx'];
}

const CustomPagination: React.FC<CustomPaginationProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
  siblingCount = 1,
  sx,
}) => {
  const theme = useTheme();
  const totalPages = Math.ceil(count / rowsPerPage);
  

  const handlePrevious = () => {
    if (page > 0) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages - 1) {
      onPageChange(page + 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const generatePageItems = (): (number | 'ellipsis')[] => {
    const totalPageNumbersToShow = siblingCount * 2 + 3;
    const totalBlocks = totalPageNumbersToShow + 2;

    if (totalPages <= totalBlocks) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const leftSiblingIndex = Math.max(page - siblingCount, 0);
    const rightSiblingIndex = Math.min(page + siblingCount, totalPages - 1);

    const shouldShowLeftEllipsis = leftSiblingIndex > 1;
    const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 0;
    const lastPageIndex = totalPages - 1;

    if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i);
      return [...leftRange, 'ellipsis', lastPageIndex];
    }

    if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => lastPageIndex - rightItemCount + 1 + i);
      return [firstPageIndex, 'ellipsis', ...rightRange];
    }

    if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, 'ellipsis', ...middleRange, 'ellipsis', lastPageIndex];
    }

    return Array.from({ length: totalPages }, (_, i) => i);
  };

  const pageItems = generatePageItems();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, ...sx }}>
      <Stack direction="row" spacing={0.5} alignItems="center">
        <IconButton
          onClick={handlePrevious}
          disabled={page === 0}
          aria-label="previous page"
          size="small"
          sx={{ mr: 1 }}
        >
          <NavigateBefore />
        </IconButton>

        {pageItems.map((item, index) => {
          if (item === 'ellipsis') {
            return (
              <Typography
                key={`ellipsis-${index}`}
                sx={{
                  px: 0.5,
                  color: 'text.disabled',
                  userSelect: 'none',
                  display: 'inline-block',
                  lineHeight: '26px'
                }}
                component="span"
              >
                ...
              </Typography>
            );
          } else {
            // Page number button
            const pageNumber = item as number;
            const isActive = pageNumber === page;
            return (
              <Button
                key={pageNumber}
                size="small"
                variant={isActive ? 'contained' : 'outlined'}
                color="primary"
                onClick={() => handlePageClick(pageNumber)}
                disabled={isActive}
                sx={{
                  minWidth: '32px',
                  px: '6px',
                  py: '4px',
                  fontWeight: isActive ? 'bold' : 'normal',
                  boxShadow: isActive ? theme.shadows[2] : 'none',
                }}
              >
                {pageNumber + 1}
              </Button>
            );
          }
        })}

        <IconButton
          onClick={handleNext}
          disabled={page >= totalPages - 1}
          aria-label="next page"
          size="small"
          sx={{ ml: 1 }}
        >
          <NavigateNext />
        </IconButton>
      </Stack>
    </Box>
  );
};

export default CustomPagination;