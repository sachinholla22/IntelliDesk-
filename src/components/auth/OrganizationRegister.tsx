import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, Check, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { handleApiResponse } from '../../utils/api';
import { Organization, OrgPlan } from '../../types';
import { ORG_PLAN_OPTIONS, INDUSTRY_OPTIONS } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

interface OrganizationFormData {
  orgName: string;
  orgEmail: string;
  orgAddr: string;
  orgPassword: string;
  orgPhone: string;
  industryType: string;
  orgPlan: OrgPlan;
}

const OrganizationRegister: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<OrganizationFormData>({
    defaultValues: {
      orgPlan: 'BASE',
    },
  });

  const selectedPlan = watch('orgPlan');

  const nextStep = async () => {
    const fieldsToValidate = currentStep === 1 
      ? ['orgName', 'orgEmail', 'orgAddr'] 
      : ['orgPassword', 'orgPhone', 'industryType'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: OrganizationFormData) => {
    try {
      setLoading(true);
      const payload = {
        ...data,
        orgPhone: parseInt(data.orgPhone),
      };
      
      const response = await api.post('/organization/create-organization', payload);
      const result = handleApiResponse(response);
      
      toast.success('Organization registered successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Register Your Organization
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of 3
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Organization Details
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Organization Name
                    </label>
                    <input
                      {...register('orgName', { required: 'Organization name is required' })}
                      className="mt-1 input-field"
                      placeholder="Enter organization name"
                    />
                    {errors.orgName && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Organization Email
                    </label>
                    <input
                      {...register('orgEmail', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      type="email"
                      className="mt-1 input-field"
                      placeholder="Enter organization email"
                    />
                    {errors.orgEmail && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Address
                    </label>
                    <textarea
                      {...register('orgAddr', { required: 'Address is required' })}
                      rows={3}
                      className="mt-1 input-field"
                      placeholder="Enter organization address"
                    />
                    {errors.orgAddr && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgAddr.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <input
                      {...register('orgPassword', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      type="password"
                      className="mt-1 input-field"
                      placeholder="Enter password"
                    />
                    {errors.orgPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgPassword.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Phone Number
                    </label>
                    <input
                      {...register('orgPhone', {
                        required: 'Phone number is required',
                        pattern: {
                          value: /^\d{10,}$/,
                          message: 'Please enter a valid phone number',
                        },
                      })}
                      type="tel"
                      className="mt-1 input-field"
                      placeholder="Enter phone number"
                    />
                    {errors.orgPhone && (
                      <p className="mt-1 text-sm text-red-600">{errors.orgPhone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Industry Type
                    </label>
                    <select
                      {...register('industryType', { required: 'Industry type is required' })}
                      className="mt-1 input-field"
                    >
                      <option value="">Select industry</option>
                      {INDUSTRY_OPTIONS.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                    {errors.industryType && (
                      <p className="mt-1 text-sm text-red-600">{errors.industryType.message}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Choose Your Plan
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ORG_PLAN_OPTIONS.map((plan) => (
                    <div
                      key={plan.value}
                      className={`relative rounded-lg border-2 p-6 cursor-pointer transition-all duration-200 ${
                        selectedPlan === plan.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => register('orgPlan').onChange({ target: { value: plan.value } })}
                    >
                      <input
                        {...register('orgPlan')}
                        type="radio"
                        value={plan.value}
                        className="sr-only"
                      />
                      
                      {selectedPlan === plan.value && (
                        <div className="absolute top-4 right-4">
                          <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {plan.label}
                          </h4>
                          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                            {plan.price}
                          </p>
                        </div>
                        
                        <ul className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                              <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              )}
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center space-x-2 btn-primary ml-auto"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center space-x-2 btn-primary ml-auto"
                >
                  {loading ? <LoadingSpinner size="sm" /> : 'Create Organization'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister;