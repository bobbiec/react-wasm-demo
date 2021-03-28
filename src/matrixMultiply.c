#include <emscripten/emscripten.h>

EMSCRIPTEN_KEEPALIVE float *matrixMultiply(float *arg1, float *arg2, float *result, int length)
{
    // TODO: figure out the memory thing
    for (unsigned int i = 0; i < length; i++)
    {

        for (unsigned int j = 0; j < length; j++)
        {

            for (unsigned int k = 0; k < length; k++)
            {

                result[i * length + j] += (arg1[i * length + k] * arg2[j * length + k]);
            }
        }
    }

    return result;
}

EMSCRIPTEN_KEEPALIVE int add(int a, int b)
{
    // trivial function for testing
    return a + b;
}