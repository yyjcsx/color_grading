# color_grading
一．实现思路讲解：

如lut图所知，单个方格中自左至右R值逐渐增大，单个方格自上而下G值逐渐增大，方格中同一点坐标，B值随方格自左至右逐渐增大。图中是一个32*32*32的lut图

<img width="416" alt="image" src="https://user-images.githubusercontent.com/50654768/172302735-e505e59f-6e8b-4554-a941-542a2e7cab3b.png">

1. _COLORs不仅表明了绿色G共分为了几阶，还表明了lut图共有_COLOR个方块
2. 得到输入图像的color_rgb值(0-1区间)，再将其映射到lut图像中的对应区间，即(0-_COLORs-1)，得到transform_RGB
3. 对B进行插值，计算B落在floor_B和high_B两个格子之间
4. 根据上面lut图的几何关系，计算像素值在lut图上的对应像素点坐标(转化为(u , v)坐标，均在0-1之间)。
5. 使用texture函数进行纹理查找，得到变换后的颜色
6. 对得到的颜色根据B进行插值，得到最终结果
二．自定义lut图以及运行结果：
使用了标准lut
<img width="256" alt="image" src="https://user-images.githubusercontent.com/50654768/172302711-dc09b8df-1200-4a6c-a2df-4510d2358db0.png">



替换后结果如图所示
<img width="416" alt="image" src="https://user-images.githubusercontent.com/50654768/172302675-12d3eea3-3ca0-4a1b-89dd-44d31eff04b3.png">
