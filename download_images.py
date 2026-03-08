import urllib.request, os, time
os.makedirs('images', exist_ok=True)
images = [
    ("https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80","floral-wrap-midi-dress.jpg"),
    ("https://images.unsplash.com/photo-1594938298603-c8148c4b4357?w=400&q=80","wide-leg-linen-trousers.jpg"),
    ("https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80","silk-satin-blouse.jpg"),
    ("https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&q=80","oversized-knit-cardigan.jpg"),
    ("https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80","pleated-mini-skirt.jpg"),
    ("https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&q=80","linen-coord-jumpsuit.jpg"),
    ("https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&q=80","boho-floral-maxi-dress.jpg"),
    ("https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&q=80","power-shoulder-blazer-dress.jpg"),
    ("https://images.unsplash.com/photo-1554412933-514a83d2f3c8?w=400&q=80","ribbed-bodycon-mini-dress.jpg"),
    ("https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80","satin-slip-evening-dress.jpg"),
    ("https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&q=80","cropped-denim-jacket-women.jpg"),
    ("https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80","high-waist-mom-jeans.jpg"),
    ("https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=400&q=80","printed-wrap-blouse.jpg"),
    ("https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&q=80","velvet-midi-slip-dress.jpg"),
    ("https://images.unsplash.com/photo-1548454782-15b189d129ab?w=400&q=80","trench-coat-classic.jpg"),
    ("https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&q=80","corset-top-bralette.jpg"),
    ("https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=80","campus-oversized-hoodie.jpg"),
    ("https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=400&q=80","printed-maxi-wrap-skirt.jpg"),
    ("https://images.unsplash.com/photo-1547949003-9792a18a2601?w=400&q=80","puffer-quilted-jacket-women.jpg"),
    ("https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&q=80","slim-fit-chino-trousers.jpg"),
    ("https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&q=80","oxford-button-down-shirt.jpg"),
    ("https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&q=80","premium-leather-jacket.jpg"),
    ("https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&q=80","merino-wool-crew-sweater.jpg"),
    ("https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=80","cargo-utility-shorts.jpg"),
    ("https://images.unsplash.com/photo-1603252109303-2751441dd157?w=400&q=80","linen-summer-shirt.jpg"),
    ("https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?w=400&q=80","classic-denim-jacket-men.jpg"),
    ("https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80","tech-fleece-track-suit.jpg"),
    ("https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80","2-piece-business-suit.jpg"),
    ("https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80","oversized-streetwear-tee.jpg"),
    ("https://images.unsplash.com/photo-1594938374182-a55a1e12f0e6?w=400&q=80","slim-chino-suit-trousers.jpg"),
    ("https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&q=80","puffer-down-jacket-men.jpg"),
    ("https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80","campus-jogger-pants.jpg"),
    ("https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400&q=80","flannel-check-overshirt.jpg"),
    ("https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80","polo-shirt-classic-fit.jpg"),
    ("https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=400&q=80","washed-denim-jeans.jpg"),
    ("https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80","bomber-flight-jacket.jpg"),
    ("https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400&q=80","adidas-forum-low.jpg"),
    ("https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80","nike-air-force-1.jpg"),
    ("https://images.unsplash.com/photo-1539185441755-769473a23570?w=400&q=80","adidas-stan-smith.jpg"),
    ("https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80","nike-air-max-270.jpg"),
    ("https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80","chelsea-ankle-boots.jpg"),
    ("https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&q=80","platform-block-heel-sandals.jpg"),
    ("https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=400&q=80","converse-chuck-taylor-high.jpg"),
    ("https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=80","leather-oxford-dress-shoes.jpg"),
    ("https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80","vans-old-skool-classic.jpg"),
    ("https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80","puma-suede-classic.jpg"),
    ("https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=400&q=80","timberland-6inch-boots.jpg"),
    ("https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80","gucci-horsebit-loafers.jpg"),
    ("https://images.unsplash.com/photo-1556906781-9a412961a28c?w=400&q=80","jordan-1-retro-high.jpg"),
    ("https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80","casio-gshock-dw5600.jpg"),
    ("https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&q=80","seiko-5-sports-automatic.jpg"),
    ("https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80","daniel-wellington-classic.jpg"),
    ("https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80","fossil-gen6-smartwatch.jpg"),
    ("https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80","casio-vintage-gold.jpg"),
    ("https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&q=80","tommy-hilfiger-classic-watch.jpg"),
    ("https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&q=80","citizen-eco-drive-solar.jpg"),
    ("https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&q=80","nixon-time-teller.jpg"),
    ("https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400&q=80","armani-exchange-stainless.jpg"),
    ("https://images.unsplash.com/photo-1510017803434-a899398421b3?w=400&q=80","garmin-forerunner-255.jpg"),
    ("https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400&q=80","casio-f91w-digital.jpg"),
    ("https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&q=80","michael-kors-rose-gold.jpg"),
    ("https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80","leather-tote-shoulder-bag.jpg"),
    ("https://images.unsplash.com/photo-1601924638867-3a6de6b7a500?w=400&q=80","silk-printed-square-scarf.jpg"),
    ("https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&q=80","mini-crossbody-bag.jpg"),
    ("https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=80","snapback-cap-streetwear.jpg"),
    ("https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80","gold-cuban-link-chain.jpg"),
    ("https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80","aviator-sunglasses.jpg"),
    ("https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80","leather-belt-braided.jpg"),
    ("https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80","gold-hoop-earrings-set.jpg"),
    ("https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=400&q=80","beanie-knit-winter-hat.jpg"),
    ("https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&q=80","leather-card-holder-wallet.jpg"),
    ("https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400&q=80","straw-bucket-hat-summer.jpg"),
    ("https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80","statement-pearl-necklace.jpg"),
    ("https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=400&q=80","kids-denim-bib-set.jpg"),
    ("https://images.unsplash.com/photo-1476234251651-f353703a034d?w=400&q=80","girls-tutu-party-dress.jpg"),
]
headers = {'User-Agent': 'Mozilla/5.0'}
total = len(images)
success = 0
for i, (url, filename) in enumerate(images, 1):
    filepath = os.path.join('images', filename)
    if os.path.exists(filepath):
        print(f'  [{i}/{total}] SKIP: {filename}')
        success += 1
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=15) as resp:
            with open(filepath, 'wb') as f:
                f.write(resp.read())
        print(f'  [{i}/{total}] OK: {filename}')
        success += 1
        time.sleep(0.1)
    except Exception as e:
        print(f'  [{i}/{total}] FAIL: {filename} - {e}')
print(f'Done! {success}/{total} downloaded.')
