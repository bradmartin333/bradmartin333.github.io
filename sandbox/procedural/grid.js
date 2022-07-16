class Grid
{
    constructor(width, height)
    {
        this.resize(width, height);
    }

    // Index of the value in (x, y) coordinates
    indexOf(x, y)
    {
        return y * this.width + x;
    }

    get(x, y)
    {
        return this.values[this.indexOf(x, y)];
    }

    resize(width, height)
    {
        this.width = width;
        this.height = height;
        this.values = new Array(width * height);
    }

    noise()
    {
        for(let n = 0; n < this.values.length; ++n)
        {
            this.values[n] = Math.random() * 2 - 1;
        }
    }

    draw(canvas)
    {
        const context = canvas.getContext("2d");
        const imageData = context.createImageData(this.width, this.height);

        for(let y = 0; y < this.height; ++y)
        {
            for(let x = 0; x < this.width; ++x)
            {
                const value = this.get(x, y) * 255;

                // imageData.data is array of RGBA values, four values per pixel
                let n = this.indexOf(x, y) * 4;

                if(value >= 0) // Positive value: fill with green
                {
                    imageData.data[n++] = 0;
                    imageData.data[n++] = value;
                }
                else // Negative value: fill with red
                {
                    imageData.data[n++] = -value;
                    imageData.data[n++] = 0;
                }
                imageData.data[n++] = 0;
                imageData.data[n] = 255;
            }
        }

        context.putImageData(imageData, 0, 0);
    }

    indexOf(x, y)
    {
        x = x >= 0 ? (x % this.width) : (this.width + (x % this.width));
        y = y >= 0 ? (y % this.height) : (this.height + (y % this.height));
        return y * this.width + x;
    }

    normalize()
    {
        let max = 0;

        for(let n = 0; n < this.values.length; ++n)
        {
            if(Math.abs(this.values[n]) > max)
            {
                max = Math.abs(this.values[n]);
            }
        }

        if(max)
        {
            for(let n = 0; n < this.values.length; ++n)
            {
                this.values[n] /= max;
            }
        }
    }

    blur(depth)
    {
        for(let n = 0; n < depth; ++n)
        {
            // Create additional buffer for the next blur step
            const buffer = new Array(this.values.length);

            for(let y = 0; y < this.height; ++y)
            {
                for(let x = 0; x < this.width; ++x)
                {
                    // Fill this buffer with the arithmetic mean of 3x3 pixels
                    buffer[this.indexOf(x, y)] =
                      (this.get(x - 1, y + 1) + this.get(x, y + 1) + this.get(x + 1, y + 1) +
                       this.get(x - 1, y    ) + this.get(x, y    ) + this.get(x + 1, y    ) +
                       this.get(x - 1, y - 1) + this.get(x, y - 1) + this.get(x + 1, y - 1)) / 9;
                }
            }

            // Replace the current grid buffer with the filled one
            this.values = buffer;
        }
    }
};