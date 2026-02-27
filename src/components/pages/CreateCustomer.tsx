import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { Link } from 'react-router-dom'

const customerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must be less than 100 characters' }),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, {
      message: 'Enter a valid 10-digit Indian mobile number',
    }),
  email: z
    .string()
    .trim()
    .email({ message: 'Enter a valid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  pan: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
      message: 'Enter a valid PAN number (e.g., ABCDE1234F)',
    })
    .transform((val) => val.toUpperCase()),
  gst: z
    .string()
    .trim()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
      message: 'Enter a valid GST number (e.g., 22AAAAA0000A1Z5)',
    })
    .transform((val) => val.toUpperCase()),
})

type CustomerFormValues = z.infer<typeof customerFormSchema>

const CreateCustomer = () => {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      pan: '',
      gst: '',
    },
  })

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create customer')
      }

      toast.success('Customer created successfully')

      form.reset()
    } catch (error) {
      toast.error('Failed to create customer. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-secondary/30 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-8">
          <Link
            to="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
        <div className="bg-card rounded-2xl shadow-(--shadow-soft) border border-border/50 overflow-hidden">
          {/* Header */}
          <div className="bg-black p-8 text-primary-foreground">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-lg">
                <UserPlus className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold">New Customer</h1>
            </div>
            <p className="text-primary-foreground/90">
              Enter customer details to create a new record
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          className="h-11 transition-all focus:shadow-md"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="9876543210"
                            {...field}
                            className="h-11 transition-all focus:shadow-md"
                          />
                        </FormControl>
                        <FormDescription>
                          10-digit mobile number
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            className="h-11 transition-all focus:shadow-md"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PAN Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="ABCDE1234F"
                            {...field}
                            className="h-11 uppercase transition-all focus:shadow-md"
                          />
                        </FormControl>
                        <FormDescription>10-character PAN</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gst"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GST Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="22AAAAA0000A1Z5"
                            {...field}
                            className="h-11 uppercase transition-all focus:shadow-md"
                          />
                        </FormControl>
                        <FormDescription>15-character GSTIN</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    className="w-full h-12 text-base font-semibold hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                  >
                    Create Customer
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-4">
          All fields are required. Data will be validated before submission.
        </p>
      </div>
    </div>
  )
}

export default CreateCustomer

