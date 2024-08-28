/* eslint-disable tailwindcss/no-custom-classname */

import * as React from "react"

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const Logo: React.FunctionComponent<LogoProps> = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="115"
      height="25"
      viewBox="0 0 230 50"
    >
      <defs>
        <style>
          {`
      .cls-2 {
        font-size: 279.007px;
        fill: #00695c;
        text-anchor: middle;
        font-weight: 700;
      }

      .cls-2 {
        font-size: 220px !important; 
      }
          `}
        </style>
      </defs>
      <image
        id="cloud"
        x="9"
        width="83"
        height="49"
        xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFMAAAAxCAYAAACmjpVRAAADTklEQVRoge2bW4hNURiAv7ObhqJxN5FGjTSFXHKbSUJKuaQMxrxM88CjEg8k3kQkGsoTKY0XE5NGFCnjToYRTy65DPMgUx4YFIZW/Wc6zpyz5+y1195nnX3293jOWXv/+2uvs9b61/oTbW9fERLDgWXAdKACmAqMBPqAbuAN8A7oAB4Cf8MKzBQlIdxjHVAPrBB5ufARuAicEbkFgRNgkOuBJ0ArUOdBpGISsBV4BFwCFgQYpzGCkFkuAs4Dcwxcb410+wMGrhUopmVuBF6IANPsBp7Lf62VmJS5A2gBRgT4oDOATmB2gPfQxpTMzcCRkGIeJt2+KqT75YyJ0XwxcCqkeJOUAneBCcCvDN/Pl+9GAQmgF/gkfxNfggrKr8yxwDVDsXhlDHABWCvt1OyhFqgGKrNc6xtwD2gHTgI9JgPyO2m/ASw1F44WB4FZwEqPjb8C+4FDpgLxI3NuIU2oXeiQN/qD3wv5GYCO+b25JcwDngIz/YajK1NNxhfZaEaT0cBjyRtooytzSz6fPCBKZAzQRkemkzKCRo1xwNEwZU6RRERU2S4pwlBkLoywyCT7dBrpyLRyXWyYBklme0JHZhgJ5XyTkGWyJ3Rkjo+MMnc2eW2Q61u2QZaNS4BpBgO2mUZ5O28Ct4Bm4I9bvIMtJ1Wyd6+J1UEE6JI04/Fsj5Ktmw+VjExLLLKfCllC3882dcokc6KsVWvDibHgqJa86IBNvnSZKg/4zMYstmWUSbZ/eWpY6TJvS9I1JjeuSzZ/gMwm6eIx3mhNl6m2T7fFErVQU8bVpMhsKqz4reMEIlN17VXFbsMnk9Vg5Mihqhj/1Dkyb4rxT7Ujyd4Y/1Q5Lhv2Md74rWQOiaUZoc8J8uxNkVGqZL4sdguG6FUyQ6sQiDidSuaVYrdgiHYl8zLwMxKPk1+aHTksav3he8tpA94n94CSo3pZsVvRRJ1w6U5mjfqkVifGOzulwu6/5PBV4HQs0xN3gMPJBunbFqpq4py9sVvFA6kF7SfT7mR9PCANylmgRq3HU3+Ybd98j1QvdOU/bqv4Lts7DZmCcjtr1Cp7Q7vUsB99T670SFVGpduJjlyrLRJSGlIjgst1jtwVED+Az8BrqUxW80j1WXaAf7iZg9F+jRh/AAAAAElFTkSuQmCC"
      />
      <text
        id="FilePoin"
        className="cls-2 font-sans"
        transform="translate(121.58 48.934) scale(0.161)"
      >
        <tspan x="0">FilePoin</tspan>
      </text>
    </svg>
  )
}

export default Logo
