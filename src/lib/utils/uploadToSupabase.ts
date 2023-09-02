import { decode } from 'base64-arraybuffer'
import { v4 as uuid } from 'uuid'
import { Client } from '../services'

const uploadToSupabase = async (
  supabaseClient: Client,
  base64Image: string,
  imageExtension = 'jpg',
  bucketName = 'stories',
  fileName = `${bucketName}-${uuid()}.jpg`
): Promise<string | null> => {
  try {
    const base64Str = base64Image.includes('base64,')
      ? base64Image.substring(
        base64Image.indexOf('base64,') + 'base64,'.length
      )
      : base64Image
    const res = decode(base64Str)

    if (!(res.byteLength > 0)) {
      console.error('[uploadToSupabase] ArrayBuffer is null')
      return null
    }

    const { data, error } = await supabaseClient.storage
      .from(bucketName)
      .upload(`${fileName}`, res, {
        contentType: `image/${imageExtension}`,
        upsert: true,
      })
    if (!data) {
      console.error('[uploadToSupabase] Data is null')
      return null
    }

    if (error) {
      console.error('[uploadToSupabase] upload: ', error)
      return null
    }
    const { data: { publicUrl: url } } = supabaseClient.storage
      .from(bucketName)
      .getPublicUrl(data.path)


    if (!url) {
      console.error('[uploadToSupabase] publicURL is null')
      return null
    }

    return url
  } catch (err) {
    console.error(err)
    return null
  }
}

export default uploadToSupabase