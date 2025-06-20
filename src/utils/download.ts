export const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(url);
};

export const generateReportFilename = (
    type: 'pdf' | 'excel',
    fromDate: string,
    toDate: string,
    isAdmin: boolean = false
): string => {
    const prefix = isAdmin ? 'BaoCao_HeThong' : 'BaoCao_CaNhan';
    const extension = type === 'pdf' ? 'pdf' : 'xlsx';
    return `${prefix}_${fromDate}_${toDate}.${extension}`;
};
