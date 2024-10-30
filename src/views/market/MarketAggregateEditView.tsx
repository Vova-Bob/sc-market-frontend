import React from "react"
//
// export function MarketAggregateEditView() {
//     // TODO: Update listing details
//     const [listing,] = useCurrentMarketAggregate()
//     const {data: profile} = useGetUserProfileQuery()
//     const [currentOrg] = useCurrentOrg()
//
//     const amContractor = useMemo(() => currentOrg?.spectrum_id === listing?.contractor_seller?.spectrum_id, [currentOrg?.spectrum_id, listing?.contractor_seller])
//     const amSeller = useMemo(() => (profile?.username === listing?.user_seller?.username) && !currentOrg, [currentOrg, listing?.user_seller?.username, profile?.username])
//
//     const amContractorManager = useMemo(() =>
//             amContractor && ['admin', 'owner']
//                 .includes(
//                     currentOrg?.members.find(item => item.username === profile?.username)?.role || 'nobody'
//                 ),
//         [currentOrg, profile, amContractor]
//     )
//
//     const amRelated = useMemo(() => amSeller || amContractorManager || profile?.role === 'admin', [amSeller, amContractorManager, profile?.role])
//
//     const {data: contractor} = useGetContractorBySpectrumIDQuery(listing.contractor_seller?.spectrum_id!, {skip: !listing.contractor_seller})
//
//     const issueAlert = useAlertHook()
//
//     const [
//         updateListing, // This is the mutation trigger
//         {isLoading}, // This is the destructured mutation result
//     ] = useUpdateMarketListing()
//
//     const [quantity, setQuantity] = useState(listing.quantity_available)
//     const [price, setPrice] = useState(listing.price)
//     const [increment, setIncrement] = useState(listing.minimum_bid_increment)
//     const [description, setDescription] = useState(listing.description)
//     const [title, setTitle] = useState(listing.title)
//     const [type, setType] = useState(listing.item_type)
//     const [photo, setPhoto] = useState(listing.photos[0])
//     const [photoOpen, setPhotoOpen] = useState(false)
//     const [showPhotoButton, setShowPhotoButton] = useState(false)
//
//     const updateListingCallback = useCallback(async (body) => {
//         const res: { data?: any, error?: any } = await updateListing({
//             listing_id: listing.listing_id,
//             body,
//         })
//
//         if (res?.data && !res?.error) {
//             issueAlert({
//                 message: "Updated!",
//                 severity: 'success'
//             })
//         } else {
//             issueAlert({
//                 message: `Error while updating! ${res.error?.error || res.error?.data?.error || res.error}`,
//                 severity: 'error'
//             })
//         }
//     }, [listing.listing_id, issueAlert, updateListing])
//
//     return (
//         <>
//             <Grid item xs={12} lg={12}>
//                 <Grid container spacing={2}>
//                     <Grid item xs={12} lg={4}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12} lg={12}>
//                                 {profile && !amRelated && <Navigate to={'/404'}/>}
//
//                                 <Box
//                                     position={'relative'}
//                                     onMouseEnter={() => setShowPhotoButton(true)}
//                                     onMouseLeave={() => setShowPhotoButton(false)}
//                                 >
//                                     <IconButton
//                                         sx={{
//                                             opacity: showPhotoButton ? 1 : 0,
//                                             position: 'absolute',
//                                             zIndex: 50,
//                                             transition: '0.3s',
//                                             color: 'white',
//                                             top: 20,
//                                             left: 20
//                                         }}
//                                         onClick={() => setPhotoOpen(true)}
//                                     >
//                                         <EditRounded/>
//                                     </IconButton>
//
//                                     <CardMedia
//                                         component="img"
//                                         height={400}
//                                         image={listing.photos[0] || MISSING_IMAGE_URL}
//                                         alt={listing.description}
//                                         sx={{
//                                             borderRadius: 3,
//                                             opacity: showPhotoButton ? .5 : 1,
//                                             transition: '0.5s',
//                                         }}
//                                     />
//                                     <ImageSearch open={photoOpen} setOpen={setPhotoOpen} callback={async (arg) => {
//                                         if (arg) {
//                                             setPhoto(arg)
//                                             await updateListingCallback({photo: arg})
//                                         }
//                                     }}/>
//                                 </Box>
//                                 <Helmet>
//                                     <script type="application/ld+json">
//                                         {JSON.stringify({
//                                             "@context": "https://schema.org",
//                                             "@type": "Product",
//                                             "seller": {
//                                                 "@type": listing.contractor_seller ? "Contractor" : "User",
//                                                 "name": listing.contractor_seller?.name || listing.user_seller?.display_name
//                                             },
//                                             "description": listing.description,
//                                             "name": listing.title,
//                                             "price": `${listing.price} aUEC`,
//                                             "kind": listing.item_type
//                                         })}
//                                     </script>
//                                 </Helmet>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//
//                     <Grid item xs={12} lg={8}>
//                         <Grid container spacing={2}>
//                             <Grid item xs={12}>
//                                 <Fade in={true}>
//                                     <Card variant={'outlined'} sx={{
//                                         borderRadius: 3,
//                                         minHeight: 400,
//                                     }}>
//                                         <CardContent sx={{
//                                             width: '100%',
//                                             minHeight: 192,
//                                             padding: 3,
//                                         }}>
//                                             <Box sx={{
//                                                 marginBottom: 2,
//                                                 // minWidth: 200
//                                             }}>
//                                                 {
//                                                     listing.status === 'active' ?
//                                                         <Button variant={'outlined'} color={'warning'}
//                                                                 onClick={() => updateListingCallback({status: listing.status === 'active' ? 'inactive' : 'active'})}
//                                                                 startIcon={<RadioButtonUncheckedRounded/>}>
//                                                             Deactivate Listing
//                                                         </Button>
//                                                         :
//                                                         <Button variant={'outlined'} color={'success'}
//                                                                 onClick={() => updateListingCallback({status: listing.status === 'active' ? 'inactive' : 'active'})}
//                                                                 startIcon={<RadioButtonCheckedRounded/>}>
//                                                             Activate Listing
//                                                         </Button>
//                                                 }
//                                             </Box>
//                                             <Box sx={{paddingBottom: 2, display: 'flex', "& > *": {marginRight: 2}}}>
//                                                 <TextField
//                                                     inputProps={{
//                                                         inputMode: 'numeric',
//                                                         pattern: '[0-9]*',
//                                                     }}
//                                                     sx={{
//                                                         marginRight: 2,
//                                                         width: '75%',
//                                                     }}
//                                                     size="small"
//                                                     label={'Title'}
//                                                     value={title}
//                                                     onChange={
//                                                         (event: React.ChangeEvent<{ value: string }>) => {
//                                                             setTitle(event.target.value)
//                                                         }
//                                                     }
//                                                     color={'secondary'}
//                                                 />
//                                                 <Button
//                                                     onClick={() => updateListingCallback({title})}
//                                                     variant={'contained'}
//                                                 >
//                                                     Update
//                                                 </Button>
//                                             </Box>
//                                             <Box sx={{paddingBottom: 2, display: 'flex', "& > *": {marginRight: 2}}}>
//                                                 <TextField
//                                                     sx={{
//                                                         marginRight: 2,
//                                                         width: '75%',
//                                                         '& .MuiSelect-icon': {
//                                                             fill: 'white',
//                                                         },
//                                                     }}
//                                                     select
//                                                     size={'small'}
//                                                     label="Item Type"
//                                                     id="order-type" value={type}
//                                                     defaultValue={'Armor'}
//                                                     onChange={
//                                                         (event: React.ChangeEvent<{ value: string }>) => {
//                                                             setType(event.target.value as typeof type)
//                                                         }
//                                                     }
//                                                     color={'secondary'}
//                                                     SelectProps={{
//                                                         IconComponent: KeyboardArrowDownRoundedIcon
//                                                     }}
//                                                 >
//                                                     <MenuItem color={'secondary'} value="armor">Armor</MenuItem>
//                                                     <MenuItem value="weapon">Weapon</MenuItem>
//                                                     <MenuItem value="paint">Paint</MenuItem>
//                                                     <MenuItem value="bundle">Bundle</MenuItem>
//                                                     <MenuItem value="other">Other</MenuItem>
//                                                 </TextField>
//                                                 <Button
//                                                     onClick={() => updateListingCallback({item_type: type})}
//                                                     variant={'contained'}
//                                                 >
//                                                     Update
//                                                 </Button>
//                                             </Box>
//                                             <Box sx={{
//                                                 paddingBottom: 2,
//                                             }}>
//                                                 <Divider light/>
//                                             </Box>
//                                             <Box sx={{
//                                                 paddingBottom: 2,
//                                                 display: 'flex',
//                                                 "& > *": {marginRight: 2}
//                                             }}>
//                                                 <TextField
//                                                     inputProps={{
//                                                         inputMode: 'numeric',
//                                                         pattern: '[0-9]*',
//                                                     }}
//                                                     sx={{
//                                                         marginRight: 2,
//                                                         width: '75%',
//                                                     }}
//                                                     size="small"
//                                                     label={'Quantity Available'}
//                                                     value={quantity.toLocaleString(undefined)}
//                                                     onChange={
//                                                         (event: React.ChangeEvent<{ value: string }>) => {
//                                                             setQuantity(displayLocaleNumber(quantity, event.target.value))
//                                                         }
//                                                     }
//                                                     color={'secondary'}
//                                                 />
//                                                 <Button
//                                                     onClick={() => updateListingCallback({quantity_available: quantity})}
//                                                     variant={'contained'}
//                                                 >
//                                                     Update
//                                                 </Button>
//                                             </Box>
//                                             <Box sx={{paddingBottom: 2, display: 'flex', "& > *": {marginRight: 2}}}>
//                                                 <TextField
//                                                     inputProps={{
//                                                         inputMode: 'numeric',
//                                                         pattern: '[0-9]*',
//                                                     }}
//                                                     sx={{
//                                                         marginRight: 2,
//                                                         width: '75%',
//                                                     }}
//                                                     disabled={listing.sale_type === 'auction'}
//                                                     size="small"
//                                                     label={'Price'}
//                                                     value={price.toLocaleString(undefined)}
//                                                     onChange={
//                                                         (event: React.ChangeEvent<{ value: string }>) => {
//                                                             setPrice(displayLocaleNumber(price, event.target.value))
//                                                         }
//                                                     }
//                                                     InputProps={{
//                                                         endAdornment: (
//                                                             <InputAdornment position="end">
//                                                                 aUEC
//                                                             </InputAdornment>
//                                                         ),
//                                                     }}
//                                                     color={'secondary'}
//                                                 />
//                                                 <Button
//                                                     onClick={() => updateListingCallback({price})}
//                                                     variant={'contained'}
//                                                     disabled={listing.sale_type === 'auction'}
//
//                                                 >
//                                                     Update
//                                                 </Button>
//                                             </Box>
//                                             {listing.sale_type === 'auction' ?
//                                                 <Box
//                                                     sx={{paddingBottom: 2, display: 'flex', "& > *": {marginRight: 2}}}>
//                                                     <TextField
//                                                         inputProps={{
//                                                             inputMode: 'numeric',
//                                                             pattern: '[0-9]*',
//                                                         }}
//                                                         sx={{
//                                                             marginRight: 2,
//                                                             width: '75%',
//                                                         }}
//                                                         disabled={listing.sale_type !== 'auction'}
//                                                         size="small"
//                                                         label={'Minimum Bid Increment'}
//                                                         value={increment.toLocaleString(undefined)}
//                                                         onChange={
//                                                             (event: React.ChangeEvent<{ value: string }>) => {
//                                                                 setIncrement(displayLocaleNumber(increment, event.target.value))
//                                                             }
//                                                         }
//                                                         InputProps={{
//                                                             endAdornment: (
//                                                                 <InputAdornment position="end">
//                                                                     aUEC
//                                                                 </InputAdornment>
//                                                             ),
//                                                         }}
//                                                         color={'secondary'}
//                                                     />
//                                                     <Button
//                                                         onClick={() => updateListingCallback({minimum_bid_increment: increment})}
//                                                         variant={'contained'}
//                                                         disabled={listing.sale_type !== 'auction'}
//
//                                                     >
//                                                         Update
//                                                     </Button>
//                                                 </Box> : null}
//                                             <Divider light/>
//                                             <Box sx={{marginTop: 2}}>
//                                                 <TextField
//                                                     sx={{marginRight: 2, marginBottom: 1}}
//                                                     fullWidth
//                                                     multiline
//                                                     minRows={8}
//                                                     label={'Description'}
//                                                     value={description}
//                                                     onChange={
//                                                         (event: React.ChangeEvent<{ value: string }>) => {
//                                                             setDescription(event.target.value)
//                                                         }
//                                                     }
//                                                     color={'secondary'}
//                                                 />
//                                                 <Button
//                                                     onClick={() => updateListingCallback({description})}
//                                                     variant={'contained'}
//                                                 >
//                                                     Update
//                                                 </Button>
//                                             </Box>
//                                             <Typography>
//                                                 <MarkdownRender text={description}/>
//                                             </Typography>
//                                         </CardContent>
//                                     </Card>
//                                 </Fade>
//                             </Grid>
//                         </Grid>
//                     </Grid>
//                 </Grid>
//             </Grid>
//         </>
//     )
// }

export const MarketAggregateEditView = () => <div />
