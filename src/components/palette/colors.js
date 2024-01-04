import chroma from 'chroma-js'

// lab hsl lch oklab oklch

function generateColorArray(colors) {
  return colors.match(/.{6}/g).map(color => '#' + color)
}

const inferno = generateColorArray(
  '00000401000501010601010802010a02020c02020e03021004031204031405041706041907051b08051d09061f0a07220b07240c08260d08290e092b10092d110a30120a32140b34150b37160b39180c3c190c3e1b0c411c0c431e0c451f0c48210c4a230c4c240c4f260c51280b53290b552b0b572d0b592f0a5b310a5c320a5e340a5f3609613809623909633b09643d09653e0966400a67420a68440a68450a69470b6a490b6a4a0c6b4c0c6b4d0d6c4f0d6c510e6c520e6d540f6d550f6d57106e59106e5a116e5c126e5d126e5f136e61136e62146e64156e65156e67166e69166e6a176e6c186e6d186e6f196e71196e721a6e741a6e751b6e771c6d781c6d7a1d6d7c1d6d7d1e6d7f1e6c801f6c82206c84206b85216b87216b88226a8a226a8c23698d23698f24699025689225689326679526679727669827669a28659b29649d29649f2a63a02a63a22b62a32c61a52c60a62d60a82e5fa92e5eab2f5ead305dae305cb0315bb1325ab3325ab43359b63458b73557b93556ba3655bc3754bd3853bf3952c03a51c13a50c33b4fc43c4ec63d4dc73e4cc83f4bca404acb4149cc4248ce4347cf4446d04545d24644d34743d44842d54a41d74b3fd84c3ed94d3dda4e3cdb503bdd513ade5238df5337e05536e15635e25734e35933e45a31e55c30e65d2fe75e2ee8602de9612bea632aeb6429eb6628ec6726ed6925ee6a24ef6c23ef6e21f06f20f1711ff1731df2741cf3761bf37819f47918f57b17f57d15f67e14f68013f78212f78410f8850ff8870ef8890cf98b0bf98c0af98e09fa9008fa9207fa9407fb9606fb9706fb9906fb9b06fb9d07fc9f07fca108fca309fca50afca60cfca80dfcaa0ffcac11fcae12fcb014fcb216fcb418fbb61afbb81dfbba1ffbbc21fbbe23fac026fac228fac42afac62df9c72ff9c932f9cb35f8cd37f8cf3af7d13df7d340f6d543f6d746f5d949f5db4cf4dd4ff4df53f4e156f3e35af3e55df2e661f2e865f2ea69f1ec6df1ed71f1ef75f1f179f2f27df2f482f3f586f3f68af4f88ef5f992f6fa96f8fb9af9fc9dfafda1fcffa4',
)
const plasma = generateColorArray(
  '0d088710078813078916078a19068c1b068d1d068e20068f2206902406912605912805922a05932c05942e05952f059631059733059735049837049938049a3a049a3c049b3e049c3f049c41049d43039e44039e46039f48039f4903a04b03a14c02a14e02a25002a25102a35302a35502a45601a45801a45901a55b01a55c01a65e01a66001a66100a76300a76400a76600a76700a86900a86a00a86c00a86e00a86f00a87100a87201a87401a87501a87701a87801a87a02a87b02a87d03a87e03a88004a88104a78305a78405a78606a68707a68808a68a09a58b0aa58d0ba58e0ca48f0da4910ea3920fa39410a29511a19613a19814a099159f9a169f9c179e9d189d9e199da01a9ca11b9ba21d9aa31e9aa51f99a62098a72197a82296aa2395ab2494ac2694ad2793ae2892b02991b12a90b22b8fb32c8eb42e8db52f8cb6308bb7318ab83289ba3388bb3488bc3587bd3786be3885bf3984c03a83c13b82c23c81c33d80c43e7fc5407ec6417dc7427cc8437bc9447aca457acb4679cc4778cc4977cd4a76ce4b75cf4c74d04d73d14e72d24f71d35171d45270d5536fd5546ed6556dd7566cd8576bd9586ada5a6ada5b69db5c68dc5d67dd5e66de5f65de6164df6263e06363e16462e26561e26660e3685fe4695ee56a5de56b5de66c5ce76e5be76f5ae87059e97158e97257ea7457eb7556eb7655ec7754ed7953ed7a52ee7b51ef7c51ef7e50f07f4ff0804ef1814df1834cf2844bf3854bf3874af48849f48948f58b47f58c46f68d45f68f44f79044f79143f79342f89441f89540f9973ff9983ef99a3efa9b3dfa9c3cfa9e3bfb9f3afba139fba238fca338fca537fca636fca835fca934fdab33fdac33fdae32fdaf31fdb130fdb22ffdb42ffdb52efeb72dfeb82cfeba2cfebb2bfebd2afebe2afec029fdc229fdc328fdc527fdc627fdc827fdca26fdcb26fccd25fcce25fcd025fcd225fbd324fbd524fbd724fad824fada24f9dc24f9dd25f8df25f8e125f7e225f7e425f6e626f6e826f5e926f5eb27f4ed27f3ee27f3f027f2f227f1f426f1f525f0f724f0f921',
)
const magma = generateColorArray(
  '00000401000501010601010802010902020b02020d03030f03031204041405041606051806051a07061c08071e0907200a08220b09240c09260d0a290e0b2b100b2d110c2f120d31130d34140e36150e38160f3b180f3d19103f1a10421c10441d11471e114920114b21114e22115024125325125527125829115a2a115c2c115f2d11612f116331116533106734106936106b38106c390f6e3b0f703d0f713f0f72400f74420f75440f764510774710784910784a10794c117a4e117b4f127b51127c52137c54137d56147d57157e59157e5a167e5c167f5d177f5f187f601880621980641a80651a80671b80681c816a1c816b1d816d1d816e1e81701f81721f817320817521817621817822817922827b23827c23827e24828025828125818326818426818627818827818928818b29818c29818e2a81902a81912b81932b80942c80962c80982d80992d809b2e7f9c2e7f9e2f7fa02f7fa1307ea3307ea5317ea6317da8327daa337dab337cad347cae347bb0357bb2357bb3367ab5367ab73779b83779ba3878bc3978bd3977bf3a77c03a76c23b75c43c75c53c74c73d73c83e73ca3e72cc3f71cd4071cf4070d0416fd2426fd3436ed5446dd6456cd8456cd9466bdb476adc4869de4968df4a68e04c67e24d66e34e65e44f64e55064e75263e85362e95462ea5661eb5760ec5860ed5a5fee5b5eef5d5ef05f5ef1605df2625df2645cf3655cf4675cf4695cf56b5cf66c5cf66e5cf7705cf7725cf8745cf8765cf9785df9795df97b5dfa7d5efa7f5efa815ffb835ffb8560fb8761fc8961fc8a62fc8c63fc8e64fc9065fd9266fd9467fd9668fd9869fd9a6afd9b6bfe9d6cfe9f6dfea16efea36ffea571fea772fea973feaa74feac76feae77feb078feb27afeb47bfeb67cfeb77efeb97ffebb81febd82febf84fec185fec287fec488fec68afec88cfeca8dfecc8ffecd90fecf92fed194fed395fed597fed799fed89afdda9cfddc9efddea0fde0a1fde2a3fde3a5fde5a7fde7a9fde9aafdebacfcecaefceeb0fcf0b2fcf2b4fcf4b6fcf6b8fcf7b9fcf9bbfcfbbdfcfdbf',
)

const dayAndNight = [
  '#040b3c',
  '#040b3c',
  '#033073',
  '#2171da',
  '#74d4a9',
  '#fffee0',
  '#ffe89e',
  '#fac263',
  '#fcc093',
  '#fd9e58',
  '#f06b7e',
  '#ca5a92',
  '#5b2c83',
  '#040b3c',
  '#040b3c',
]

export const defaultPalettes = [
  {
    id: 'DayAndNight',
    isDynamic: true,
    colors: chroma.scale(dayAndNight).mode('hsl').colors(25),
  },
  {
    id: 'YlGnBu',
    isDynamic: true,
    // colors: chroma.scale('YlGnBu').mode('hsl').colors(25),
    colors: chroma
      .scale([
        ...chroma.scale('YlGnBu').padding([-0.1, -0.1]).gamma(1.5).mode('hsl').colors(13).toReversed(),
        ...chroma.scale('YlGnBu').padding([-0.1, -0.1]).gamma(1.5).mode('hsl').colors(13),
      ])
      .mode('hsl')
      .colors(25),
  },

  {
    id: 'yellow-navy-1-2',
    isDynamic: true,
    colors: chroma
      .scale([
        ...chroma.scale(['yellow', 'navy']).padding([-0.5, -0.5]).gamma(1.2).mode('hsl').colors(13).toReversed(),
        ...chroma.scale(['yellow', 'navy']).padding([-0.5, -0.5]).gamma(1.2).mode('hsl').colors(13),
      ])
      .mode('hsl')
      .colors(25),
  },
  {
    id: 'Viridis',
    isDynamic: true,
    // colors: chroma.scale('Viridis').mode('hsl').colors(25).toReversed(),
    colors: chroma
      .scale([
        ...chroma.scale('Viridis').padding([-0.5, -0.5]).gamma(1.5).mode('hsl').colors(13),
        ...chroma.scale('Viridis').padding([-0.5, -0.5]).gamma(1.5).mode('hsl').colors(13).toReversed(),
      ])
      .mode('hsl')
      .colors(25),
  },
  {
    id: 'yellow-navy-2',
    isDynamic: true,
    // colors: chroma.scale(['yellow', 'navy']).mode('lch').colors(25),
    colors: chroma
      .scale([
        ...chroma.scale(['yellow', 'navy']).padding([-0.3, -0.3]).gamma(1).mode('lch').colors(13).toReversed(),
        ...chroma.scale(['yellow', 'navy']).padding([-0.3, -0.3]).gamma(1).mode('lch').colors(13),
      ])
      .mode('lch')
      .colors(25),
  },
  {
    id: 'Inferno',
    isDynamic: true,
    // colors: chroma.scale(inferno).mode('hsl').colors(25).toReversed(),
    colors: chroma
      .scale([
        ...chroma.scale(inferno).padding([-0.2, -0.2]).gamma(1.5).mode('hsl').colors(13),
        ...chroma.scale(inferno).padding([-0.2, -0.2]).gamma(1.5).mode('hsl').colors(13).toReversed(),
      ])
      .mode('hsl')
      .colors(25),
  },
  {
    id: 'plasma',
    isDynamic: true,
    // colors: chroma.scale(plasma).mode('hsl').colors(25).toReversed(),
    colors: chroma
      .scale([
        ...chroma.scale(plasma).padding([-0.2, -0.2]).gamma(1.5).mode('hsl').colors(13),
        ...chroma.scale(plasma).padding([-0.2, -0.2]).gamma(1.5).mode('hsl').colors(13).toReversed(),
      ])
      .mode('hsl')
      .colors(25),
  },
  {
    id: 'magma',
    isDynamic: true,
    // colors: chroma.scale(magma).mode('hsl').colors(25).toReversed(),
    colors: chroma
      .scale([
        ...chroma.scale(magma).padding([-0.2, -0.2]).gamma(1).mode('hsl').colors(13),
        ...chroma.scale(magma).padding([-0.2, -0.2]).gamma(1).mode('hsl').colors(13).toReversed(),
      ])
      .mode('hsl')
      .colors(25),
  },
]
