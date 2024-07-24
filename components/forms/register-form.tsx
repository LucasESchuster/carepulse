'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Form } from '@/components/ui/form'
import CustomFormField from '../custom-form-field'
import SubmitButton from '../submit-button'
import { useState } from 'react'
import { UserFormValidation } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/patient.actions'
import { FormFieldType } from './PatientForm'

export function RegisterForm({ user }: { user: User }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  })

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true)

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      }
      console.log(user)
      const newUser = await createUser(user)
      console.log(newUser)

      if (newUser) {
        router.push(`/patients/${newUser.$id}/register`)
      }
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="johndoe@lucas.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone number"
            placeholder="(555) 123-4567 "
          />
        </div>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}
