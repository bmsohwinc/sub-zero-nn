import numpy as np

# create np array
def tutorial_1():
    v1 = np.array([3, 5, 6, 1])
    print(v1)

    v2 = np.array([[2, 3, 4], [7, 8, 1]])
    print(v2)
    print('-----------')

# access numpy array
def tutorial_2():
    v1 = np.array([3, 5, 6, 1])
    print(v1)

    print(v1[0])
    print(v1.ndim)
    print('-----------')


tutorial_1()
tutorial_2()
