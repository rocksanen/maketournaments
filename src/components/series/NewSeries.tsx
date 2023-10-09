import { CREATE_SERIES } from '@/graphql/clientQueries/seriesOperations'

import { Link, Card, Button, Input } from '@nextui-org/react'
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import { useMutation } from '@apollo/client'

function NewSeries() {
  const [seriesName, setSeriesName] = useState('')
  const [createSeries] = useMutation(CREATE_SERIES)
  const [isInvalid, setIsInvalid] = useState(false)
  const { data: session } = useSession()

  const handleCreateSeries = async () => {
    if (seriesName.length < 3) {
      setIsInvalid(true)
      return
    }
    try {
      const response = await createSeries({
        variables: {
          input: {
            name: seriesName,
            tournaments: [],
            admin: session?.user?.id,
            seriesCreated: new Date().toISOString(),
          },
        },
      })
      if (response.data.createSeries.success) {
        setSeriesName('')
        alert('Series created successfully!')
      } else {
        alert(response.data.createSeries.message)
      }
    } catch (err) {
      console.log(err)
      alert('Error. Please try again later.')
    }
  }

  return (
    <div>
      <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
        <ul className="flex">
          <li className="flex gap-2">
            <HouseIcon />
            <Link href={'/'}>
              <span>Home</span>
            </Link>
            <span> / </span>
          </li>
        </ul>

        {/* Add new series form, if user is not logged in, show link to log in */}
        <h3 className="text-xl font-semibold">Add New Series</h3>
        <div className="flex justify-between flex-wrap gap-4 items-center">
          <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
            <Card className="p-6">
              <Input
                type="text"
                label="Series Name"
                variant="bordered"
                value={seriesName}
                isInvalid={isInvalid}
                color={isInvalid ? 'danger' : 'default'}
                errorMessage={isInvalid && 'Series Name should be at least 3 characters.'}
                onChange={(e) => {
                  setIsInvalid(false)
                  setSeriesName(e.target.value)
                }}
              />
              <Button className="mt-5" color="primary" onClick={handleCreateSeries}>
                Create Series
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewSeries
