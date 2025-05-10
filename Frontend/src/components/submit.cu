#include <cuda_runtime.h>
#include <stdio.h>
#include <stdlib.h>

__global__ void elementWiseMul3D(float *input1, float *input2, float *output, int dataSize) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    int z = blockIdx.z * blockDim.z + threadIdx.z;
    int idx = z * (gridDim.x * blockDim.x * gridDim.y * blockDim.y) + y * (gridDim.x * blockDim.x) + x;
    if (idx < dataSize) output[idx] = input1[idx] * input2[idx];
}

__global__ void elementWiseMul2D(float *input1, float *input2, float *output, int dataSize) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    int idx = y * (gridDim.x * blockDim.x) + x;
    if (idx < dataSize) output[idx] = input1[idx] * input2[idx];
}

__global__ void elementWiseMul1D(float *input1, float *input2, float *output, int dataSize) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < dataSize) output[idx] = input1[idx] * input2[idx];
}

void initializeData(float *data, int size) {
    for (int i = 0; i < size; i++) {
        data[i] = rand() % 10;
    }
}

void printData(float *data, int size) {
    for (int i = 0; i < size; i++) {
        printf("%.2f ", data[i]);
    }
    printf("\n");
}

int main() {
    int dataSize = 1024;
    size_t size = dataSize * sizeof(float);
    float *h_input1, *h_input2, *h_output;
    float *d_input1, *d_input2, *d_output;

    h_input1 = (float *)malloc(size);
    h_input2 = (float *)malloc(size);
    h_output = (float *)malloc(size);

    initializeData(h_input1, dataSize);
    initializeData(h_input2, dataSize);

    cudaMalloc(&d_input1, size);
    cudaMalloc(&d_input2, size);
    cudaMalloc(&d_output, size);

    cudaMemcpy(d_input1, h_input1, size, cudaMemcpyHostToDevice);
    cudaMemcpy(d_input2, h_input2, size, cudaMemcpyHostToDevice);

    dim3 threadsPerBlock(32, 32);
    dim3 numBlocks(32, 32);
    elementWiseMul2D<<<numBlocks, threadsPerBlock>>>(d_input1, d_input2, d_output, dataSize);
    cudaMemcpy(h_output, d_output, size, cudaMemcpyDeviceToHost);

    printData(h_output, dataSize);

    cudaFree(d_input1);
    cudaFree(d_input2);
    cudaFree(d_output);
    free(h_input1);
    free(h_input2);
    free(h_output);
    return 0;
}


//Question 2

__global__ void rowConvolution(float *input, float *output, float *mask, int n) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    if (x < n && y < n) {
        float sum = 0.0;
        for (int i = -1; i <= 1; i++) {
            int idx = x + i;
            if (idx >= 0 && idx < n) sum += mask[i + 1] * input[y * n + idx];
        }
        output[y * n + x] = sum;
    }
}

__global__ void colConvolution(float *input, float *output, float *mask, int n) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    if (x < n && y < n) {
        float sum = 0.0;
        for (int i = -1; i <= 1; i++) {
            int idx = y + i;
            if (idx >= 0 && idx < n) sum += mask[i + 1] * input[idx * n + x];
        }
        output[y * n + x] = sum;
    }
}

int main() {
    int n = 3;
    float h_input[9] = {3, 3, 3, 3, 3, 3, 3, 3, 3};
    float h_mask[3] = {0.0, 1.0, 0.0};
    float h_output[9];

    float *d_input, *d_output, *d_mask;
    cudaMalloc(&d_input, 9 * sizeof(float));
    cudaMalloc(&d_output, 9 * sizeof(float));
    cudaMalloc(&d_mask, 3 * sizeof(float));

    cudaMemcpy(d_input, h_input, 9 * sizeof(float), cudaMemcpyHostToDevice);
    cudaMemcpy(d_mask, h_mask, 3 * sizeof(float), cudaMemcpyHostToDevice);

    dim3 threadsPerBlock(3, 3);
    dim3 numBlocks(1, 1);
    rowConvolution<<<numBlocks, threadsPerBlock>>>(d_input, d_output, d_mask, n);
    cudaMemcpy(h_output, d_output, 9 * sizeof(float), cudaMemcpyDeviceToHost);

    printf("Row-wise Convolution:\n");
    printData(h_output, 9);

    colConvolution<<<numBlocks, threadsPerBlock>>>(d_output, d_input, d_mask, n);
    cudaMemcpy(h_output, d_input, 9 * sizeof(float), cudaMemcpyDeviceToHost);
    printf("Column-wise Convolution:\n");
    printData(h_output, 9);

    cudaFree(d_input);
    cudaFree(d_output);
    cudaFree(d_mask);
    return 0;
}
